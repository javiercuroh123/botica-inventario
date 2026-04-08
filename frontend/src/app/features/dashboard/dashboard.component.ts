import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from './dashboard.service';
import { DashboardData } from '../../shared/interfaces/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  loading = true;
  errorMessage = '';
  dashboard: DashboardData | null = null;

  resumenColumns: string[] = ['titulo', 'valor'];
  stockBajoColumns: string[] = ['codigo', 'nombre', 'stock_actual', 'stock_minimo'];
  lotesPorVencerColumns: string[] = [
    'producto_nombre',
    'numero_lote',
    'fecha_vencimiento',
    'cantidad_actual'
  ];
  comprasColumns: string[] = ['fecha_compra', 'comprobante', 'proveedor', 'total'];
  movimientosColumns: string[] = [
    'fecha_movimiento',
    'tipo_movimiento',
    'producto_nombre',
    'cantidad'
  ];

  resumenData: Array<{ titulo: string; valor: number }> = [];

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;
        this.resumenData = [
          {
            titulo: 'Productos activos',
            valor: response.data.resumen.total_productos_activos
          },
          {
            titulo: 'Productos con stock bajo',
            valor: response.data.resumen.productos_stock_bajo
          },
          {
            titulo: 'Lotes por vencer (30 días)',
            valor: response.data.resumen.lotes_por_vencer_30
          },
          {
            titulo: 'Lotes vencidos con stock',
            valor: response.data.resumen.lotes_vencidos_con_stock
          }
        ];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo cargar el dashboard';
        this.loading = false;
      }
    });
  }
}