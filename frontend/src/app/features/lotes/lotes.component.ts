import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
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
import { MatIconModule } from '@angular/material/icon';
import { ProductosService } from '../productos/productos.service';
import { LotesService } from './lotes.service';
import { Producto } from '../../shared/interfaces/producto.interface';
import { Lote } from '../../shared/interfaces/lote.interface';
import { PaginationMeta } from '../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-lotes',
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
    MatPaginatorModule,
    MatIconModule
  ],
  templateUrl: './lotes.component.html',
  styleUrl: './lotes.component.scss'
})
export class LotesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private lotesService = inject(LotesService);
  private productosService = inject(ProductosService);

  lotes: Lote[] = [];
  productos: Producto[] = [];
  displayedColumns: string[] = [
    'id',
    'producto',
    'lote',
    'vencimiento',
    'inicial',
    'actual',
    'costo',
    'ingreso',
    'estado',
    'acciones'
  ];

  pagination: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  };

  loading = false;
  saving = false;
  loadingProductos = false;
  errorMessage = '';
  successMessage = '';
  editingId: number | null = null;

  form = this.fb.group({
    producto_id: [null as number | null, [Validators.required]],
    numero_lote: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
    ],
    fecha_vencimiento: [''],
    cantidad_inicial: [0, [Validators.required, Validators.min(0)]],
    cantidad_actual: [0, [Validators.required, Validators.min(0)]],
    costo_unitario: [0, [Validators.required, Validators.min(0)]],
    fecha_ingreso: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadProductos();
    this.loadLotes();
    this.form.patchValue({
      fecha_ingreso: new Date().toISOString().slice(0, 10)
    });
  }

  get productoControl() {
    return this.form.get('producto_id');
  }

  get numeroLoteControl() {
    return this.form.get('numero_lote');
  }

  get fechaVencimientoControl() {
    return this.form.get('fecha_vencimiento');
  }

  get cantidadInicialControl() {
    return this.form.get('cantidad_inicial');
  }

  get cantidadActualControl() {
    return this.form.get('cantidad_actual');
  }

  get costoUnitarioControl() {
    return this.form.get('costo_unitario');
  }

  get fechaIngresoControl() {
    return this.form.get('fecha_ingreso');
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

  loadLotes(page = this.pagination.page, limit = this.pagination.limit): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.lotesService.findAll(page, limit).subscribe({
      next: (response) => {
        this.lotes = response.data.items;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo cargar los lotes';
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const cantidadInicial = Number(this.form.value.cantidad_inicial ?? 0);
    const cantidadActual = Number(this.form.value.cantidad_actual ?? 0);

    if (cantidadActual > cantidadInicial) {
      this.errorMessage =
        'La cantidad actual no puede ser mayor que la cantidad inicial';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      producto_id: Number(this.form.value.producto_id),
      numero_lote: this.form.value.numero_lote?.trim() || '',
      fecha_vencimiento: this.form.value.fecha_vencimiento || '',
      cantidad_inicial: cantidadInicial,
      cantidad_actual: cantidadActual,
      costo_unitario: Number(this.form.value.costo_unitario ?? 0),
      fecha_ingreso: this.form.value.fecha_ingreso || ''
    };

    const request$ = this.editingId
      ? this.lotesService.update(this.editingId, payload)
      : this.lotesService.create(payload);

    request$.subscribe({
      next: (response) => {
        this.successMessage =
          response.message ||
          (this.editingId
            ? 'Lote actualizado correctamente'
            : 'Lote creado correctamente');

        this.resetForm();
        this.loadLotes(this.pagination.page, this.pagination.limit);
        this.saving = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo guardar el lote';
        this.saving = false;
      }
    });
  }

  editLote(lote: Lote): void {
    this.editingId = lote.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.form.patchValue({
      producto_id: lote.producto_id,
      numero_lote: lote.numero_lote,
      fecha_vencimiento: lote.fecha_vencimiento || '',
      cantidad_inicial: Number(lote.cantidad_inicial),
      cantidad_actual: Number(lote.cantidad_actual),
      costo_unitario: Number(lote.costo_unitario),
      fecha_ingreso: lote.fecha_ingreso
    });
  }

  removeLote(lote: Lote): void {
    const confirmed = window.confirm(
      `¿Deseas desactivar el lote "${lote.numero_lote}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.lotesService.remove(lote.id).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || 'Lote desactivado correctamente';
        this.loadLotes(this.pagination.page, this.pagination.limit);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo desactivar el lote';
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      producto_id: null,
      numero_lote: '',
      fecha_vencimiento: '',
      cantidad_inicial: 0,
      cantidad_actual: 0,
      costo_unitario: 0,
      fecha_ingreso: new Date().toISOString().slice(0, 10)
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadLotes(event.pageIndex + 1, event.pageSize);
  }
}