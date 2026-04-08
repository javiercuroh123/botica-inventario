import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { ComprasController } from './compras.controller';
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
  ComprasController.findAll
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN', 'CAJERO'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  ComprasController.findById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN'),
  [
    body('proveedor_id')
      .isInt({ min: 1 })
      .withMessage('proveedor_id inválido'),
    body('fecha_compra')
      .optional({ values: 'falsy' })
      .isISO8601()
      .withMessage('fecha_compra debe tener formato YYYY-MM-DD'),
    body('tipo_comprobante')
      .notEmpty()
      .withMessage('El tipo de comprobante es obligatorio')
      .isLength({ min: 2, max: 30 })
      .withMessage('El tipo de comprobante debe tener entre 2 y 30 caracteres'),
    body('numero_comprobante')
      .notEmpty()
      .withMessage('El número de comprobante es obligatorio')
      .isLength({ min: 2, max: 50 })
      .withMessage('El número de comprobante debe tener entre 2 y 50 caracteres'),
    body('observacion')
      .optional({ values: 'falsy' })
      .isLength({ max: 1000 })
      .withMessage('La observación no debe superar 1000 caracteres'),
    body('detalles')
      .isArray({ min: 1 })
      .withMessage('Debe enviar al menos un detalle'),
    body('detalles.*.producto_id')
      .isInt({ min: 1 })
      .withMessage('producto_id inválido'),
    body('detalles.*.numero_lote')
      .optional({ values: 'falsy' })
      .isLength({ min: 2, max: 100 })
      .withMessage('El número de lote debe tener entre 2 y 100 caracteres'),
    body('detalles.*.fecha_vencimiento')
      .optional({ values: 'falsy' })
      .isISO8601()
      .withMessage('fecha_vencimiento debe tener formato YYYY-MM-DD'),
    body('detalles.*.cantidad')
      .isFloat({ gt: 0 })
      .withMessage('La cantidad debe ser mayor que 0'),
    body('detalles.*.precio_unitario')
      .isFloat({ min: 0 })
      .withMessage('El precio unitario debe ser mayor o igual a 0')
  ],
  ComprasController.create
);

export default router;