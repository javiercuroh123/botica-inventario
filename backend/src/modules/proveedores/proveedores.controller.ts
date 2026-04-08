import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ProveedoresService } from './proveedores.service';
import { AppError } from '../../utils/app-error';
import { getPagination } from '../../utils/pagination';

export class ProveedoresController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError('Error de validación', 400, errors.array());
      }

      const pagination = getPagination(req.query.page, req.query.limit);
      const proveedores = await ProveedoresService.findAll(pagination);

      return res.json({
        ok: true,
        data: proveedores
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
      const proveedor = await ProveedoresService.findById(id);

      if (!proveedor) {
        throw new AppError('Proveedor no encontrado', 404);
      }

      return res.json({
        ok: true,
        data: proveedor
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

      const proveedor = await ProveedoresService.create(req.body);

      return res.status(201).json({
        ok: true,
        message: 'Proveedor creado correctamente',
        data: proveedor
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
      const proveedor = await ProveedoresService.update(id, req.body);

      return res.json({
        ok: true,
        message: 'Proveedor actualizado correctamente',
        data: proveedor
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
      const proveedor = await ProveedoresService.remove(id);

      return res.json({
        ok: true,
        message: 'Proveedor desactivado correctamente',
        data: proveedor
      });
    } catch (error) {
      next(error);
    }
  }
}