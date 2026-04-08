import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UsersService } from './users.service';

export class UsersController {
  static async findAll(_req: Request, res: Response) {
    const users = await UsersService.findAll();

    return res.json({
      ok: true,
      data: users
    });
  }

  static async create(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        errors: errors.array()
      });
    }

    try {
      const user = await UsersService.create(req.body);

      return res.status(201).json({
        ok: true,
        message: 'Usuario creado correctamente',
        data: user
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        message: error instanceof Error ? error.message : 'Error al crear usuario'
      });
    }
  }
}