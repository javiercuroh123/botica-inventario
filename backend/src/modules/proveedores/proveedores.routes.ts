import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { ProveedoresController } from './proveedores.controller';
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
  ProveedoresController.findAll
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN', 'CAJERO'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  ProveedoresController.findById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN'),
  [
    body('razon_social')
      .notEmpty()
      .withMessage('La razón social es obligatoria')
      .isLength({ min: 3, max: 200 })
      .withMessage('La razón social debe tener entre 3 y 200 caracteres'),
    body('ruc')
      .notEmpty()
      .withMessage('El RUC es obligatorio')
      .matches(/^\d{11}$/)
      .withMessage('El RUC debe tener exactamente 11 dígitos'),
    body('telefono')
      .optional({ values: 'falsy' })
      .isLength({ max: 20 })
      .withMessage('El teléfono no debe superar 20 caracteres'),
    body('correo')
      .optional({ values: 'falsy' })
      .isEmail()
      .withMessage('Correo inválido'),
    body('direccion')
      .optional({ values: 'falsy' })
      .isLength({ max: 255 })
      .withMessage('La dirección no debe superar 255 caracteres'),
    body('contacto')
      .optional({ values: 'falsy' })
      .isLength({ max: 150 })
      .withMessage('El contacto no debe superar 150 caracteres')
  ],
  ProveedoresController.create
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID inválido'),
    body('razon_social')
      .optional()
      .isLength({ min: 3, max: 200 })
      .withMessage('La razón social debe tener entre 3 y 200 caracteres'),
    body('ruc')
      .optional()
      .matches(/^\d{11}$/)
      .withMessage('El RUC debe tener exactamente 11 dígitos'),
    body('telefono')
      .optional({ values: 'falsy' })
      .isLength({ max: 20 })
      .withMessage('El teléfono no debe superar 20 caracteres'),
    body('correo')
      .optional({ values: 'falsy' })
      .isEmail()
      .withMessage('Correo inválido'),
    body('direccion')
      .optional({ values: 'falsy' })
      .isLength({ max: 255 })
      .withMessage('La dirección no debe superar 255 caracteres'),
    body('contacto')
      .optional({ values: 'falsy' })
      .isLength({ max: 150 })
      .withMessage('El contacto no debe superar 150 caracteres'),
    body('estado')
      .optional()
      .isBoolean()
      .withMessage('El estado debe ser booleano')
  ],
  ProveedoresController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  ProveedoresController.remove
);

export default router;