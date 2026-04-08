import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import {
  authenticateToken,
  authorizeRoles
} from '../../middlewares/auth.middleware';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'ALMACEN', 'CAJERO'),
  DashboardController.getDashboard
);

export default router;