export {};

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Verifica que la API esté funcionando
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: API funcionando correctamente
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Iniciar sesión
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login correcto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Obtener perfil del usuario autenticado
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 id: 1
 *                 nombres: Admin
 *                 apellidos: Principal
 *                 correo: admin@botica.com
 *                 estado: true
 *                 rol: ADMIN
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Obtener resumen general del dashboard
 *     responses:
 *       200:
 *         description: Dashboard obtenido correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Dashboard obtenido correctamente
 *               data:
 *                 resumen:
 *                   total_productos_activos: 12
 *                   productos_stock_bajo: 3
 *                   lotes_por_vencer_30: 2
 *                   lotes_vencidos_con_stock: 1
 *                 ultimas_compras: []
 *                 ultimos_movimientos: []
 *                 productos_stock_bajo_detalle: []
 *                 lotes_por_vencer_detalle: []
 */

/**
 * @openapi
 * /api/roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Listar roles
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 - id: 1
 *                   nombre: ADMIN
 *                   descripcion: Administrador del sistema
 *                   estado: true
 *                   created_at: 2026-04-06T15:30:00.000Z
 *                 - id: 2
 *                   nombre: ALMACEN
 *                   descripcion: Encargado de almacén
 *                   estado: true
 *                   created_at: 2026-04-06T15:30:00.000Z
 *       403:
 *         description: No autorizado
 */

/**
 * @openapi
 * /api/usuarios:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Listar usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 - id: 1
 *                   nombres: Admin
 *                   apellidos: Principal
 *                   correo: admin@botica.com
 *                   estado: true
 *                   created_at: 2026-04-06T15:30:00.000Z
 *                   rol: ADMIN
 *       403:
 *         description: No autorizado
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Crear usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreateRequest'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Usuario creado correctamente
 *               data:
 *                 id: 2
 *                 rol_id: 2
 *                 nombres: Javier
 *                 apellidos: Curo
 *                 correo: javier@botica.com
 *                 estado: true
 *                 created_at: 2026-04-06T16:00:00.000Z
 *       409:
 *         description: Correo ya registrado
 */

/**
 * @openapi
 * /api/categorias:
 *   get:
 *     tags:
 *       - Categorias
 *     summary: Listar categorías paginadas
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 items:
 *                   - id: 1
 *                     nombre: ANALGESICOS
 *                     descripcion: Medicamentos para dolor y fiebre
 *                     estado: true
 *                     created_at: 2026-04-06T15:30:00.000Z
 *                 pagination:
 *                   total: 1
 *                   page: 1
 *                   limit: 10
 *                   totalPages: 1
 *   post:
 *     tags:
 *       - Categorias
 *     summary: Crear categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaRequest'
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *       409:
 *         description: Ya existe una categoría con ese nombre
 */

/**
 * @openapi
 * /api/categorias/{id}:
 *   get:
 *     tags:
 *       - Categorias
 *     summary: Obtener categoría por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 *   put:
 *     tags:
 *       - Categorias
 *     summary: Actualizar categoría
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaRequest'
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *   delete:
 *     tags:
 *       - Categorias
 *     summary: Desactivar categoría
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría desactivada correctamente
 */

/**
 * @openapi
 * /api/proveedores:
 *   get:
 *     tags:
 *       - Proveedores
 *     summary: Listar proveedores paginados
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de proveedores
 *   post:
 *     tags:
 *       - Proveedores
 *     summary: Crear proveedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProveedorRequest'
 *     responses:
 *       201:
 *         description: Proveedor creado correctamente
 */

/**
 * @openapi
 * /api/productos:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Listar productos paginados
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 items:
 *                   - id: 1
 *                     categoria_id: 1
 *                     categoria: ANALGESICOS
 *                     codigo: PARA500TAB
 *                     nombre: Paracetamol 500 mg tabletas
 *                     descripcion: Caja x 100 tabletas
 *                     unidad_medida: CAJA
 *                     stock_minimo: 20
 *                     requiere_lote: true
 *                     requiere_vencimiento: true
 *                     estado: true
 *                 pagination:
 *                   total: 1
 *                   page: 1
 *                   limit: 10
 *                   totalPages: 1
 *   post:
 *     tags:
 *       - Productos
 *     summary: Crear producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoRequest'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 */

/**
 * @openapi
 * /api/lotes:
 *   get:
 *     tags:
 *       - Lotes
 *     summary: Listar lotes paginados
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de lotes
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 items:
 *                   - id: 1
 *                     producto_id: 1
 *                     producto_codigo: PARA500TAB
 *                     producto_nombre: Paracetamol 500 mg tabletas
 *                     numero_lote: LT-2026-001
 *                     fecha_vencimiento: 2027-12-31
 *                     cantidad_inicial: 100
 *                     cantidad_actual: 80
 *                     costo_unitario: 0.85
 *                     fecha_ingreso: 2026-04-06
 *                     estado: true
 *                 pagination:
 *                   total: 1
 *                   page: 1
 *                   limit: 10
 *                   totalPages: 1
 */

/**
 * @openapi
 * /api/compras:
 *   get:
 *     tags:
 *       - Compras
 *     summary: Listar compras paginadas
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de compras
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 items:
 *                   - id: 1
 *                     proveedor_id: 1
 *                     proveedor: DISTRIBUIDORA FARMACEUTICA DEL SUR S.A.C.
 *                     usuario_id: 1
 *                     usuario: Admin Principal
 *                     fecha_compra: 2026-04-06
 *                     tipo_comprobante: FACTURA
 *                     numero_comprobante: F001-000124
 *                     subtotal: 38
 *                     impuesto: 0
 *                     total: 38
 *                 pagination:
 *                   total: 1
 *                   page: 1
 *                   limit: 10
 *                   totalPages: 1
 *   post:
 *     tags:
 *       - Compras
 *     summary: Registrar una compra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompraRequest'
 *     responses:
 *       201:
 *         description: Compra registrada correctamente
 */

/**
 * @openapi
 * /api/compras/{id}:
 *   get:
 *     tags:
 *       - Compras
 *     summary: Obtener compra por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compra encontrada
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 id: 1
 *                 proveedor_id: 1
 *                 proveedor: DISTRIBUIDORA FARMACEUTICA DEL SUR S.A.C.
 *                 usuario_id: 1
 *                 usuario: Admin Principal
 *                 fecha_compra: 2026-04-06
 *                 tipo_comprobante: FACTURA
 *                 numero_comprobante: F001-000124
 *                 subtotal: 38
 *                 impuesto: 0
 *                 total: 38
 *                 observacion: Compra con usuario tomado del token
 *                 detalles:
 *                   - id: 1
 *                     compra_id: 1
 *                     producto_id: 1
 *                     producto_codigo: PARA500TAB
 *                     producto_nombre: Paracetamol 500 mg tabletas
 *                     numero_lote: LT-2026-003
 *                     fecha_vencimiento: 2028-01-31
 *                     cantidad: 40
 *                     precio_unitario: 0.95
 *                     subtotal: 38
 *       404:
 *         description: Compra no encontrada
 */

/**
 * @openapi
 * /api/movimientos:
 *   get:
 *     tags:
 *       - Movimientos
 *     summary: Listar movimientos paginados y filtrados
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: producto_id
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: lote_id
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: tipo_movimiento
 *         schema:
 *           type: string
 *           example: ENTRADA
 *       - in: query
 *         name: fecha_desde
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-04-01
 *       - in: query
 *         name: fecha_hasta
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-04-30
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 items:
 *                   - id: 1
 *                     producto_id: 1
 *                     producto_codigo: PARA500TAB
 *                     producto_nombre: Paracetamol 500 mg tabletas
 *                     lote_id: 1
 *                     numero_lote: LT-2026-003
 *                     usuario_id: 1
 *                     usuario: Admin Principal
 *                     tipo_movimiento: ENTRADA
 *                     cantidad: 40
 *                     fecha_movimiento: 2026-04-06T15:45:00.000Z
 *                     observacion: Ingreso por compra F001-000124
 *                     referencia_tipo: COMPRA
 *                     referencia_id: 1
 *                 pagination:
 *                   total: 1
 *                   page: 1
 *                   limit: 10
 *                   totalPages: 1
 */

/**
 * @openapi
 * /api/proveedores/{id}:
 *   get:
 *     tags:
 *       - Proveedores
 *     summary: Obtener proveedor por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor encontrado
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 id: 1
 *                 razon_social: DISTRIBUIDORA FARMACEUTICA DEL SUR S.A.C.
 *                 ruc: "20456789123"
 *                 telefono: "966123456"
 *                 correo: ventas@difsur.com
 *                 direccion: Av. Ejército 123, Ayacucho
 *                 contacto: Carlos Medina
 *                 estado: true
 *                 created_at: 2026-04-06T15:30:00.000Z
 *       404:
 *         description: Proveedor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     tags:
 *       - Proveedores
 *     summary: Actualizar proveedor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProveedorRequest'
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Proveedor actualizado correctamente
 *               data:
 *                 id: 1
 *                 razon_social: DISTRIBUIDORA FARMACEUTICA DEL SUR S.A.C.
 *                 ruc: "20456789123"
 *                 telefono: "988777666"
 *                 correo: ventas@difsur.com
 *                 direccion: Jr. Lima 456, Ayacucho
 *                 contacto: Carlos Medina
 *                 estado: true
 *                 created_at: 2026-04-06T15:30:00.000Z
 *       404:
 *         description: Proveedor no encontrado
 *   delete:
 *     tags:
 *       - Proveedores
 *     summary: Desactivar proveedor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor desactivado correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Proveedor desactivado correctamente
 *               data:
 *                 id: 1
 *                 razon_social: DISTRIBUIDORA FARMACEUTICA DEL SUR S.A.C.
 *                 ruc: "20456789123"
 *                 telefono: "966123456"
 *                 correo: ventas@difsur.com
 *                 direccion: Av. Ejército 123, Ayacucho
 *                 contacto: Carlos Medina
 *                 estado: false
 *                 created_at: 2026-04-06T15:30:00.000Z
 */

/**
 * @openapi
 * /api/productos/{id}:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 id: 1
 *                 categoria_id: 1
 *                 categoria: ANALGESICOS
 *                 codigo: PARA500TAB
 *                 nombre: Paracetamol 500 mg tabletas
 *                 descripcion: Caja x 100 tabletas
 *                 unidad_medida: CAJA
 *                 stock_minimo: 20
 *                 requiere_lote: true
 *                 requiere_vencimiento: true
 *                 estado: true
 *                 created_at: 2026-04-06T15:30:00.000Z
 *                 updated_at: 2026-04-06T16:00:00.000Z
 *       404:
 *         description: Producto no encontrado
 *   put:
 *     tags:
 *       - Productos
 *     summary: Actualizar producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoRequest'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Producto actualizado correctamente
 *               data:
 *                 id: 1
 *                 categoria_id: 1
 *                 codigo: PARA500TAB
 *                 nombre: Paracetamol 500 mg tabletas
 *                 descripcion: Caja x 100 tabletas - uso oral
 *                 unidad_medida: CAJA
 *                 stock_minimo: 30
 *                 requiere_lote: true
 *                 requiere_vencimiento: true
 *                 estado: true
 *                 created_at: 2026-04-06T15:30:00.000Z
 *                 updated_at: 2026-04-06T16:10:00.000Z
 *       404:
 *         description: Producto no encontrado
 *   delete:
 *     tags:
 *       - Productos
 *     summary: Desactivar producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto desactivado correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Producto desactivado correctamente
 *               data:
 *                 id: 1
 *                 categoria_id: 1
 *                 codigo: PARA500TAB
 *                 nombre: Paracetamol 500 mg tabletas
 *                 descripcion: Caja x 100 tabletas
 *                 unidad_medida: CAJA
 *                 stock_minimo: 20
 *                 requiere_lote: true
 *                 requiere_vencimiento: true
 *                 estado: false
 *                 created_at: 2026-04-06T15:30:00.000Z
 *                 updated_at: 2026-04-06T16:15:00.000Z
 */

/**
 * @openapi
 * /api/lotes/{id}:
 *   get:
 *     tags:
 *       - Lotes
 *     summary: Obtener lote por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lote encontrado
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 id: 1
 *                 producto_id: 1
 *                 producto_codigo: PARA500TAB
 *                 producto_nombre: Paracetamol 500 mg tabletas
 *                 numero_lote: LT-2026-001
 *                 fecha_vencimiento: 2027-12-31
 *                 cantidad_inicial: 100
 *                 cantidad_actual: 80
 *                 costo_unitario: 0.85
 *                 fecha_ingreso: 2026-04-06
 *                 estado: true
 *                 created_at: 2026-04-06T15:30:00.000Z
 *       404:
 *         description: Lote no encontrado
 *   put:
 *     tags:
 *       - Lotes
 *     summary: Actualizar lote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             cantidad_actual: 80
 *             costo_unitario: 0.90
 *     responses:
 *       200:
 *         description: Lote actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Lote actualizado correctamente
 *               data:
 *                 id: 1
 *                 producto_id: 1
 *                 numero_lote: LT-2026-001
 *                 fecha_vencimiento: 2027-12-31
 *                 cantidad_inicial: 100
 *                 cantidad_actual: 80
 *                 costo_unitario: 0.90
 *                 fecha_ingreso: 2026-04-06
 *                 estado: true
 *                 created_at: 2026-04-06T15:30:00.000Z
 *       404:
 *         description: Lote no encontrado
 *   delete:
 *     tags:
 *       - Lotes
 *     summary: Desactivar lote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lote desactivado correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Lote desactivado correctamente
 *               data:
 *                 id: 1
 *                 producto_id: 1
 *                 numero_lote: LT-2026-001
 *                 fecha_vencimiento: 2027-12-31
 *                 cantidad_inicial: 100
 *                 cantidad_actual: 80
 *                 costo_unitario: 0.85
 *                 fecha_ingreso: 2026-04-06
 *                 estado: false
 *                 created_at: 2026-04-06T15:30:00.000Z
 */