import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  sidenavOpened = true;

  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Categorías', route: '/categorias', icon: 'category' },
    { label: 'Proveedores', route: '/proveedores', icon: 'local_shipping' },
    { label: 'Productos', route: '/productos', icon: 'inventory_2' },
    { label: 'Lotes', route: '/lotes', icon: 'sell' },
    { label: 'Compras', route: '/compras', icon: 'shopping_cart' },
    { label: 'Movimientos', route: '/movimientos', icon: 'swap_horiz' },
    { label: 'Roles', route: '/roles', icon: 'badge' },
    { label: 'Usuarios', route: '/usuarios', icon: 'group' }
  ];

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}