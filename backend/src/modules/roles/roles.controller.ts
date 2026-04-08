import { Request, Response } from 'express';
import { RolesService } from './roles.service';

export class RolesController {
  static async findAll(_req: Request, res: Response) {
    const roles = await RolesService.findAll();

    return res.json({
      ok: true,
      data: roles
    });
  }
}