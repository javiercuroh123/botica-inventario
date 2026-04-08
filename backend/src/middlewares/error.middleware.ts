import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/app-error';

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message,
      details: err.details ?? null
    });
  }

  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    err.code === '23505'
  ) {
    return res.status(409).json({
      ok: false,
      message: 'Conflicto de datos: ya existe un registro con ese valor único'
    });
  }

  console.error('❌ Error no controlado:', err);

  return res.status(500).json({
    ok: false,
    message: 'Error interno del servidor'
  });
}