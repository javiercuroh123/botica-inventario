import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ProductosService } from './productos.service';
import { AppError } from '../../utils/app-error';
import { getPagination } from '../../utils/pagination';

export class ProductosController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Error de validación', 400, errors.array());
      }

      const pagination = getPagination(req.query.page, req.query.limit);
      const productos = await ProductosService.findAll(pagination);

      return res.json({
        ok: true,
        data: productos
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
      const producto = await ProductosService.findById(id);

      if (!producto) {
        throw new AppError('Producto no encontrado', 404);
      }

      return res.json({
        ok: true,
        data: producto
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

      const producto = await ProductosService.create(req.body);

      return res.status(201).json({
        ok: true,
        message: 'Producto creado correctamente',
        data: producto
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
      const producto = await ProductosService.update(id, req.body);

      return res.json({
        ok: true,
        message: 'Producto actualizado correctamente',
        data: producto
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
      const producto = await ProductosService.remove(id);

      return res.json({
        ok: true,
        message: 'Producto desactivado correctamente',
        data: producto
      });
    } catch (error) {
      next(error);
    }
  }
}