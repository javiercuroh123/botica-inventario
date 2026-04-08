import { pool } from '../../config/db';
import { AppError } from '../../utils/app-error';

interface CreateCompraDetalleInput {
  producto_id: number;
  numero_lote?: string;
  fecha_vencimiento?: string | null;
  cantidad: number;
  precio_unitario: number;
}

interface CreateCompraInput {
  proveedor_id: number;
  usuario_id: number;
  fecha_compra?: string;
  tipo_comprobante: string;
  numero_comprobante: string;
  observacion?: string;
  detalles: CreateCompraDetalleInput[];
}

interface FindAllComprasInput {
  page: number;
  limit: number;
  offset: number;
}

export class ComprasService {
  static async findAll({ page, limit, offset }: FindAllComprasInput) {
    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM compras;
    `;

    const dataQuery = `
      SELECT
        c.id,
        c.proveedor_id,
        p.razon_social AS proveedor,
        c.usuario_id,
        u.nombres || ' ' || u.apellidos AS usuario,
        c.fecha_compra,
        c.tipo_comprobante,
        c.numero_comprobante,
        c.subtotal,
        c.impuesto,
        c.total,
        c.observacion,
        c.created_at
      FROM compras c
      INNER JOIN proveedores p ON p.id = c.proveedor_id
      INNER JOIN usuarios u ON u.id = c.usuario_id
      ORDER BY c.id DESC
      LIMIT $1 OFFSET $2;
    `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery),
      pool.query(dataQuery, [limit, offset])
    ]);

    const total = countResult.rows[0]?.total ?? 0;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return {
      items: dataResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  static async findById(id: number) {
    const compraQuery = `
      SELECT
        c.id,
        c.proveedor_id,
        p.razon_social AS proveedor,
        c.usuario_id,
        u.nombres || ' ' || u.apellidos AS usuario,
        c.fecha_compra,
        c.tipo_comprobante,
        c.numero_comprobante,
        c.subtotal,
        c.impuesto,
        c.total,
        c.observacion,
        c.created_at
      FROM compras c
      INNER JOIN proveedores p ON p.id = c.proveedor_id
      INNER JOIN usuarios u ON u.id = c.usuario_id
      WHERE c.id = $1
      LIMIT 1;
    `;

    const detalleQuery = `
      SELECT
        dc.id,
        dc.compra_id,
        dc.producto_id,
        pr.codigo AS producto_codigo,
        pr.nombre AS producto_nombre,
        dc.numero_lote,
        dc.fecha_vencimiento,
        dc.cantidad,
        dc.precio_unitario,
        dc.subtotal
      FROM detalle_compras dc
      INNER JOIN productos pr ON pr.id = dc.producto_id
      WHERE dc.compra_id = $1
      ORDER BY dc.id ASC;
    `;

    const compraResult = await pool.query(compraQuery, [id]);

    if (compraResult.rows.length === 0) {
      return null;
    }

    const detalleResult = await pool.query(detalleQuery, [id]);

    return {
      ...compraResult.rows[0],
      detalles: detalleResult.rows
    };
  }

  static async create(data: CreateCompraInput) {
    if (!data.detalles || data.detalles.length === 0) {
      throw new AppError('La compra debe tener al menos un detalle', 400);
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const proveedorQuery = `
        SELECT id
        FROM proveedores
        WHERE id = $1 AND estado = TRUE
        LIMIT 1;
      `;

      const proveedorResult = await client.query(proveedorQuery, [data.proveedor_id]);

      if (proveedorResult.rows.length === 0) {
        throw new AppError('El proveedor no existe o está inactivo', 400);
      }

      const usuarioQuery = `
        SELECT id
        FROM usuarios
        WHERE id = $1 AND estado = TRUE
        LIMIT 1;
      `;

      const usuarioResult = await client.query(usuarioQuery, [data.usuario_id]);

      if (usuarioResult.rows.length === 0) {
        throw new AppError('El usuario no existe o está inactivo', 400);
      }

      let subtotalGeneral = 0;

      for (const item of data.detalles) {
        if (item.cantidad <= 0) {
          throw new AppError('La cantidad debe ser mayor que 0', 400);
        }

        if (item.precio_unitario < 0) {
          throw new AppError('El precio unitario no puede ser negativo', 400);
        }

        const productoQuery = `
          SELECT id, nombre, requiere_lote, requiere_vencimiento
          FROM productos
          WHERE id = $1 AND estado = TRUE
          LIMIT 1;
        `;

        const productoResult = await client.query(productoQuery, [item.producto_id]);

        if (productoResult.rows.length === 0) {
          throw new AppError(
            `El producto con ID ${item.producto_id} no existe o está inactivo`,
            400
          );
        }

        const producto = productoResult.rows[0];

        if (producto.requiere_lote && !item.numero_lote?.trim()) {
          throw new AppError(
            `El producto ${producto.nombre} requiere número de lote`,
            400
          );
        }

        if (producto.requiere_vencimiento && !item.fecha_vencimiento) {
          throw new AppError(
            `El producto ${producto.nombre} requiere fecha de vencimiento`,
            400
          );
        }

        subtotalGeneral += Number(item.cantidad) * Number(item.precio_unitario);
      }

      const impuestoGeneral = 0;
      const totalGeneral = subtotalGeneral + impuestoGeneral;

      const compraInsertQuery = `
        INSERT INTO compras (
          proveedor_id,
          usuario_id,
          fecha_compra,
          tipo_comprobante,
          numero_comprobante,
          subtotal,
          impuesto,
          total,
          observacion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, proveedor_id, usuario_id, fecha_compra, tipo_comprobante,
                  numero_comprobante, subtotal, impuesto, total, observacion, created_at;
      `;

      const fechaCompraFinal =
        data.fecha_compra || new Date().toISOString().slice(0, 10);

      const compraValues = [
        data.proveedor_id,
        data.usuario_id,
        fechaCompraFinal,
        data.tipo_comprobante.trim(),
        data.numero_comprobante.trim(),
        subtotalGeneral,
        impuestoGeneral,
        totalGeneral,
        data.observacion?.trim() || null
      ];

      const compraResult = await client.query(compraInsertQuery, compraValues);
      const compra = compraResult.rows[0];

      for (const item of data.detalles) {
        const subtotalDetalle = Number(item.cantidad) * Number(item.precio_unitario);

        const productoQuery = `
          SELECT id, nombre, requiere_lote
          FROM productos
          WHERE id = $1
          LIMIT 1;
        `;

        const productoResult = await client.query(productoQuery, [item.producto_id]);
        const producto = productoResult.rows[0];

        const numeroLoteFinal = producto.requiere_lote
          ? item.numero_lote!.trim()
          : 'SIN-LOTE';

        const detalleInsertQuery = `
          INSERT INTO detalle_compras (
            compra_id,
            producto_id,
            numero_lote,
            fecha_vencimiento,
            cantidad,
            precio_unitario,
            subtotal
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;

        await client.query(detalleInsertQuery, [
          compra.id,
          item.producto_id,
          numeroLoteFinal,
          item.fecha_vencimiento || null,
          item.cantidad,
          item.precio_unitario,
          subtotalDetalle
        ]);

        const loteExistsQuery = `
          SELECT id
          FROM lotes
          WHERE producto_id = $1
            AND LOWER(numero_lote) = LOWER($2)
          LIMIT 1;
        `;

        const loteExistsResult = await client.query(loteExistsQuery, [
          item.producto_id,
          numeroLoteFinal
        ]);

        let loteId: number;

        if (loteExistsResult.rows.length > 0) {
          const loteActual = loteExistsResult.rows[0];

          const loteUpdateQuery = `
            UPDATE lotes
            SET
              cantidad_inicial = cantidad_inicial + $1,
              cantidad_actual = cantidad_actual + $1,
              costo_unitario = $2,
              fecha_vencimiento = $3,
              fecha_ingreso = $4,
              estado = TRUE
            WHERE id = $5
            RETURNING id;
          `;

          const loteUpdateResult = await client.query(loteUpdateQuery, [
            item.cantidad,
            item.precio_unitario,
            item.fecha_vencimiento || null,
            fechaCompraFinal,
            loteActual.id
          ]);

          loteId = loteUpdateResult.rows[0].id;
        } else {
          const loteInsertQuery = `
            INSERT INTO lotes (
              producto_id,
              numero_lote,
              fecha_vencimiento,
              cantidad_inicial,
              cantidad_actual,
              costo_unitario,
              fecha_ingreso,
              estado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
            RETURNING id;
          `;

          const loteInsertResult = await client.query(loteInsertQuery, [
            item.producto_id,
            numeroLoteFinal,
            item.fecha_vencimiento || null,
            item.cantidad,
            item.cantidad,
            item.precio_unitario,
            fechaCompraFinal
          ]);

          loteId = loteInsertResult.rows[0].id;
        }

        const movimientoQuery = `
          INSERT INTO movimientos_inventario (
            producto_id,
            lote_id,
            usuario_id,
            tipo_movimiento,
            cantidad,
            fecha_movimiento,
            observacion,
            referencia_tipo,
            referencia_id
          )
          VALUES ($1, $2, $3, 'ENTRADA', $4, NOW(), $5, 'COMPRA', $6);
        `;

        await client.query(movimientoQuery, [
          item.producto_id,
          loteId,
          data.usuario_id,
          item.cantidad,
          `Ingreso por compra ${compra.numero_comprobante}`,
          compra.id
        ]);
      }

      await client.query('COMMIT');

      return await this.findById(compra.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}