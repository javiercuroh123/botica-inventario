import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CategoriasComponent } from './features/categorias/categorias.component';
import { ProveedoresComponent } from './features/proveedores/proveedores.component';
import { ProductosComponent } from './features/productos/productos.component';
import { LotesComponent } from './features/lotes/lotes.component';
import { ComprasComponent } from './features/compras/compras.component';
import { CompraDetalleComponent } from './features/compras/compra-detalle.component';
import { MovimientosComponent } from './features/movimientos/movimientos.component';
import { RolesComponent } from './features/roles/roles.component';
import { UsuariosComponent } from './features/usuarios/usuarios.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'lotes', component: LotesComponent },
      { path: 'compras', component: ComprasComponent },
      { path: 'compras/:id', component: CompraDetalleComponent },
      { path: 'movimientos', component: MovimientosComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];