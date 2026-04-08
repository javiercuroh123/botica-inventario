import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ComprasService } from './compras.service';
import { AppError } from '../../utils/app-error';
import { getPagination } from '../../utils/pagination';

export class ComprasController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Error de validación', 400, errors.array());
      }

      const pagination = getPagination(req.query.page, req.query.limit);
      const compras = await ComprasService.findAll(pagination);

      return res.json({
        ok: true,
        data: compras
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
      const compra = await ComprasService.findById(id);

      if (!compra) {
        throw new AppError('Compra no encontrada', 404);
      }

      return res.json({
        ok: true,
        data: compra
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Error de validación', 400, errors.array());
      }

      if (!req.user) {
        throw new AppError('No autenticado', 401);
      }

      const compra = await ComprasService.create({
        ...req.body,
        usuario_id: req.user.id
      });

      return res.status(201).json({
        ok: true,
        message: 'Compra registrada correctamente',
        data: compra
      });
    } catch (error) {
      next(error);
    }
  }
}