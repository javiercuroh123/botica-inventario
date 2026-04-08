import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from './auth.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.post(
  '/login',
  [
    body('correo').isEmail().withMessage('El correo no es válido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener mínimo 6 caracteres')
  ],
  AuthController.login
);

router.get('/me', authenticateToken, AuthController.me);

export default router;