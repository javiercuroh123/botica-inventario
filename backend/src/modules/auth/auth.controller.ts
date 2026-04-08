import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from './auth.service';

export class AuthController {
  static async login(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        errors: errors.array()
      });
    }

    const { correo, password } = req.body;

    const result = await AuthService.login({ correo, password });

    if (!result) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    return res.json({
      ok: true,
      message: 'Login correcto',
      data: result
    });
  }

  static async me(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'No autenticado'
      });
    }

    const profile = await AuthService.getProfile(req.user.id);

    if (!profile) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.json({
      ok: true,
      data: profile
    });
  }
}