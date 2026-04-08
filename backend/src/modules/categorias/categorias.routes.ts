import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { CategoriasController } from './categorias.controller';
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
  CategoriasController.findAll
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN', 'CAJERO'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  CategoriasController.findById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN'),
  [
    body('nombre')
      .notEmpty()
      .withMessage('El nombre es obligatorio')
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('descripcion')
      .optional()
      .isLength({ max: 255 })
      .withMessage('La descripción no debe superar 255 caracteres')
  ],
  CategoriasController.create
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID inválido'),
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('descripcion')
      .optional()
      .isLength({ max: 255 })
      .withMessage('La descripción no debe superar 255 caracteres'),
    body('estado')
      .optional()
      .isBoolean()
      .withMessage('El estado debe ser booleano')
  ],
  CategoriasController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  CategoriasController.remove
);

export default router;