import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { LotesService } from './lotes.service';
import { AppError } from '../../utils/app-error';
import { getPagination } from '../../utils/pagination';

export class LotesController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Error de validación', 400, errors.array());
      }

      const pagination = getPagination(req.query.page, req.query.limit);
      const lotes = await LotesService.findAll(pagination);

      return res.json({
        ok: true,
        data: lotes
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
      const lote = await LotesService.findById(id);

      if (!lote) {
        throw new AppError('Lote no encontrado', 404);
      }

      return res.json({
        ok: true,
        data: lote
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

      const lote = await LotesService.create(req.body);

      return res.status(201).json({
        ok: true,
        message: 'Lote creado correctamente',
        data: lote
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Error de validación', 400, errors.array());
      }

      const id = Number(req.params.id);
      const lote = await LotesService.update(id, req.body);

      return res.json({
        ok: true,
        message: 'Lote actualizado correctamente',
        data: lote
      });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Error de validación', 400, errors.array());
      }

      const id = Number(req.params.id);
      const lote = await LotesService.remove(id);

      return res.json({
        ok: true,
        message: 'Lote desactivado correctamente',
        data: lote
      });
    } catch (error) {
      next(error);
    }
  }
}