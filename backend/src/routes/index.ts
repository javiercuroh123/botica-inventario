import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import usersRoutes from '../modules/users/users.routes';
import rolesRoutes from '../modules/roles/roles.routes';
import categoriasRoutes from '../modules/categorias/categorias.routes';
import proveedoresRoutes from '../modules/proveedores/proveedores.routes';
import productosRoutes from '../modules/productos/productos.routes';
import lotesRoutes from '../modules/lotes/lotes.routes';
import comprasRoutes from '../modules/compras/compras.routes';
import movimientosRoutes from '../modules/movimientos/movimientos.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'API funcionando correctamente'
  });
});

router.use('/auth', authRoutes);
router.use('/usuarios', usersRoutes);
router.use('/roles', rolesRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/proveedores', proveedoresRoutes);
router.use('/productos', productosRoutes);
router.use('/lotes', lotesRoutes);
router.use('/compras', comprasRoutes);
router.use('/movimientos', movimientosRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;