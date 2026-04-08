import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { ProductosController } from './productos.controller';
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
  ProductosController.findAll
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN', 'CAJERO'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  ProductosController.findById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN'),
  [
    body('categoria_id')
      .isInt({ min: 1 })
      .withMessage('categoria_id inválido'),
    body('codigo')
      .notEmpty()
      .withMessage('El código es obligatorio')
      .isLength({ min: 2, max: 50 })
      .withMessage('El código debe tener entre 2 y 50 caracteres'),
    body('nombre')
      .notEmpty()
      .withMessage('El nombre es obligatorio')
      .isLength({ min: 2, max: 200 })
      .withMessage('El nombre debe tener entre 2 y 200 caracteres'),
    body('descripcion')
      .optional({ values: 'falsy' })
      .isLength({ max: 1000 })
      .withMessage('La descripción no debe superar 1000 caracteres'),
    body('unidad_medida')
      .optional({ values: 'falsy' })
      .isLength({ min: 1, max: 30 })
      .withMessage('La unidad de medida debe tener entre 1 y 30 caracteres'),
    body('stock_minimo')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('stock_minimo debe ser mayor o igual a 0'),
    body('requiere_lote')
      .optional()
      .isBoolean()
      .withMessage('requiere_lote debe ser booleano'),
    body('requiere_vencimiento')
      .optional()
      .isBoolean()
      .withMessage('requiere_vencimiento debe ser booleano')
  ],
  ProductosController.create
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID inválido'),
    body('categoria_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('categoria_id inválido'),
    body('codigo')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('El código debe tener entre 2 y 50 caracteres'),
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 200 })
      .withMessage('El nombre debe tener entre 2 y 200 caracteres'),
    body('descripcion')
      .optional({ values: 'falsy' })
      .isLength({ max: 1000 })
      .withMessage('La descripción no debe superar 1000 caracteres'),
    body('unidad_medida')
      .optional({ values: 'falsy' })
      .isLength({ min: 1, max: 30 })
      .withMessage('La unidad de medida debe tener entre 1 y 30 caracteres'),
    body('stock_minimo')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('stock_minimo debe ser mayor o igual a 0'),
    body('requiere_lote')
      .optional()
      .isBoolean()
      .withMessage('requiere_lote debe ser booleano'),
    body('requiere_vencimiento')
      .optional()
      .isBoolean()
      .withMessage('requiere_vencimiento debe ser booleano'),
    body('estado')
      .optional()
      .isBoolean()
      .withMessage('estado debe ser booleano')
  ],
  ProductosController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  ProductosController.remove
);

export default router;