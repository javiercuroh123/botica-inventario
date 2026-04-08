import { Router } from 'express';
import { param, query } from 'express-validator';
import { MovimientosController } from './movimientos.controller';
import {
  authenticateToken,
  authorizeRoles
} from '../../middlewares/auth.middleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN', 'CAJERO'),
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('page debe ser mayor o igual a 1'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('limit debe estar entre 1 y 100'),
    query('producto_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('producto_id inválido'),
    query('lote_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('lote_id inválido'),
    query('usuario_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('usuario_id inválido'),
    query('tipo_movimiento')
      .optional()
      .isIn([
        'ENTRADA',
        'SALIDA',
        'AJUSTE_ENTRADA',
        'AJUSTE_SALIDA',
        'MERMA',
        'VENCIDO'
      ])
      .withMessage('tipo_movimiento inválido'),
    query('fecha_desde')
      .optional()
      .isISO8601()
      .withMessage('fecha_desde debe tener formato YYYY-MM-DD'),
    query('fecha_hasta')
      .optional()
      .isISO8601()
      .withMessage('fecha_hasta debe tener formato YYYY-MM-DD')
  ],
  MovimientosController.findAll
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN', 'CAJERO'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  MovimientosController.findById
);

export default router;