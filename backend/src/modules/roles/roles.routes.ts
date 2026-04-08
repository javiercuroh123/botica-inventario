import { Router } from 'express';
import { RolesController } from './roles.controller';
import {
  authenticateToken,
  authorizeRoles
} from '../../middlewares/auth.middleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN'),
  RolesController.findAll
);

export default router;