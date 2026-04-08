import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CategoriasService } from './categorias.service';
import { AppError } from '../../utils/app-error';
import { getPagination } from '../../utils/pagination';

export class CategoriasController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Error de validación', 400, errors.array());
      }

      const pagination = getPagination(req.query.page, req.query.limit);
      const categorias = await CategoriasService.findAll(pagination);

      return res.json({
        ok: true,
        data: categorias
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
      const categoria = await CategoriasService.findById(id);

      if (!categoria) {
        throw new AppError('Categoría no encontrada', 404);
      }

      return res.json({
        ok: true,
        data: categoria
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

      const categoria = await CategoriasService.create(req.body);

      return res.status(201).json({
        ok: true,
        message: 'Categoría creada correctamente',
        data: categoria
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
      const categoria = await CategoriasService.update(id, req.body);

      return res.json({
        ok: true,
        message: 'Categoría actualizada correctamente',
        data: categoria
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
      const categoria = await CategoriasService.remove(id);

      return res.json({
        ok: true,
        message: 'Categoría desactivada correctamente',
        data: categoria
      });
    } catch (error) {
      next(error);
    }
  }
}