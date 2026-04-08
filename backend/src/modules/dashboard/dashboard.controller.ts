import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  static async getDashboard(_req: Request, res: Response) {
    try {
      const data = await DashboardService.getDashboard();

      return res.json({
        ok: true,
        message: 'Dashboard obtenido correctamente',
        data
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : 'Error al obtener el dashboard'
      });
    }
  }
}