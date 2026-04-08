import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { ProductosService } from '../productos/productos.service';
import { MovimientosService } from './movimientos.service';
import { Producto } from '../../shared/interfaces/producto.interface';
import { Movimiento } from '../../shared/interfaces/movimiento.interface';
import { PaginationMeta } from '../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.scss'
})
export class MovimientosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movimientosService = inject(MovimientosService);
  private productosService = inject(ProductosService);

  movimientos: Movimiento[] = [];
  productos: Producto[] = [];
  displayedColumns: string[] = [
    'id',
    'fecha',
    'tipo',
    'producto',
    'lote',
    'cantidad',
    'usuario',
    'referencia',
    'observacion'
  ];

  pagination: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  };

  loading = false;
  loadingProductos = false;
  errorMessage = '';

  form = this.fb.group({
    producto_id: [null as number | null],
    lote_id: [null as number | null],
    tipo_movimiento: [''],
    fecha_desde: [''],
    fecha_hasta: ['']
  });

  tiposMovimiento = [
    'ENTRADA',
    'SALIDA',
    'AJUSTE_ENTRADA',
    'AJUSTE_SALIDA',
    'MERMA',
    'VENCIDO'
  ];

  ngOnInit(): void {
    this.loadProductos();
    this.loadMovimientos();
  }

  loadProductos(): void {
    this.loadingProductos = true;

    this.productosService.findAll(1, 100).subscribe({
      next: (response) => {
        this.productos = response.data.items.filter((item) => item.estado);
        this.loadingProductos = false;
      },
      error: () => {
        this.loadingProductos = false;
      }
    });
  }

  loadMovimientos(page = this.pagination.page, limit = this.pagination.limit): void {
    this.loading = true;
    this.errorMessage = '';

    const raw = this.form.getRawValue();

    this.movimientosService.findAll({
      page,
      limit,
      producto_id: raw.producto_id ? Number(raw.producto_id) : null,
      lote_id: raw.lote_id ? Number(raw.lote_id) : null,
      tipo_movimiento: raw.tipo_movimiento || '',
      fecha_desde: raw.fecha_desde || '',
      fecha_hasta: raw.fecha_hasta || ''
    }).subscribe({
      next: (response) => {
        this.movimientos = response.data.items;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo cargar los movimientos';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadMovimientos(1, this.pagination.limit);
  }

  clearFilters(): void {
    this.form.reset({
      producto_id: null,
      lote_id: null,
      tipo_movimiento: '',
      fecha_desde: '',
      fecha_hasta: ''
    });

    this.loadMovimientos(1, this.pagination.limit);
  }

  onPageChange(event: PageEvent): void {
    this.loadMovimientos(event.pageIndex + 1, event.pageSize);
  }
}