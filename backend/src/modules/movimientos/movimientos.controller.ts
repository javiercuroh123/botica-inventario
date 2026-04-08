import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { MovimientosService } from './movimientos.service';
import { AppError } from '../../utils/app-error';
import { getPagination } from '../../utils/pagination';

export class MovimientosController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Error de validación', 400, errors.array());
      }

      const filters = {
        producto_id: req.query.producto_id
          ? Number(req.query.producto_id)
          : undefined,
        lote_id: req.query.lote_id ? Number(req.query.lote_id) : undefined,
        usuario_id: req.query.usuario_id
          ? Number(req.query.usuario_id)
          : undefined,
        tipo_movimiento: req.query.tipo_movimiento
          ? String(req.query.tipo_movimiento)
          : undefined,
        fecha_desde: req.query.fecha_desde
          ? String(req.query.fecha_desde)
          : undefined,
        fecha_hasta: req.query.fecha_hasta
          ? String(req.query.fecha_hasta)
          : undefined
      };

      const pagination = getPagination(req.query.page, req.query.limit);
      const movimientos = await MovimientosService.findAll(filters, pagination);

      return res.json({
        ok: true,
        data: movimientos
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Error de validación', 400, errors.array());
      }

      const id = Number(req.params.id);
      const movimiento = await MovimientosService.findById(id);

      if (!movimiento) {
        throw new AppError('Movimiento no encontrado', 404);
      }

      return res.json({
        ok: true,
        data: movimiento
      });
    } catch (error) {
      next(error);
    }
  }
}