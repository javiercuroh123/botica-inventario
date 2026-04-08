import { Router } from 'express';
import { body } from 'express-validator';
import { UsersController } from './users.controller';
import {
  authenticateToken,
  authorizeRoles
} from '../../middlewares/auth.middleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN'),
  UsersController.findAll
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN'),
  [
    body('rol_id').isInt({ min: 1 }).withMessage('rol_id inválido'),
    body('nombres').notEmpty().withMessage('Los nombres son obligatorios'),
    body('apellidos').notEmpty().withMessage('Los apellidos son obligatorios'),
    body('correo').isEmail().withMessage('Correo inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener mínimo 6 caracteres')
  ],
  UsersController.create
);

export default router;