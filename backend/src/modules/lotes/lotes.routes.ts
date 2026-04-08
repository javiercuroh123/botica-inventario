import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { LotesController } from './lotes.controller';
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
      .withMessage('limit debe estar entre 1 y 100')
  ],
  LotesController.findAll
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN', 'CAJERO'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  LotesController.findById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN'),
  [
    body('producto_id')
      .isInt({ min: 1 })
      .withMessage('producto_id inválido'),
    body('numero_lote')
      .notEmpty()
      .withMessage('El número de lote es obligatorio')
      .isLength({ min: 2, max: 100 })
      .withMessage('El número de lote debe tener entre 2 y 100 caracteres'),
    body('fecha_vencimiento')
      .optional({ values: 'falsy' })
      .isISO8601()
      .withMessage('fecha_vencimiento debe tener formato YYYY-MM-DD'),
    body('cantidad_inicial')
      .isFloat({ min: 0 })
      .withMessage('cantidad_inicial debe ser mayor o igual a 0'),
    body('cantidad_actual')
      .isFloat({ min: 0 })
      .withMessage('cantidad_actual debe ser mayor o igual a 0'),
    body('costo_unitario')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('costo_unitario debe ser mayor o igual a 0'),
    body('fecha_ingreso')
      .optional({ values: 'falsy' })
      .isISO8601()
      .withMessage('fecha_ingreso debe tener formato YYYY-MM-DD')
  ],
  LotesController.create
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID inválido'),
    body('producto_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('producto_id inválido'),
    body('numero_lote')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('El número de lote debe tener entre 2 y 100 caracteres'),
    body('fecha_vencimiento')
      .optional({ values: 'falsy' })
      .isISO8601()
      .withMessage('fecha_vencimiento debe tener formato YYYY-MM-DD'),
    body('cantidad_inicial')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('cantidad_inicial debe ser mayor o igual a 0'),
    body('cantidad_actual')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('cantidad_actual debe ser mayor o igual a 0'),
    body('costo_unitario')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('costo_unitario debe ser mayor o igual a 0'),
    body('fecha_ingreso')
      .optional({ values: 'falsy' })
      .isISO8601()
      .withMessage('fecha_ingreso debe tener formato YYYY-MM-DD'),
    body('estado')
      .optional()
      .isBoolean()
      .withMessage('estado debe ser booleano')
  ],
  LotesController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  LotesController.remove
);

export default router;