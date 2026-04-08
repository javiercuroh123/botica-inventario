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
import { CategoriasService } from '../categorias/categorias.service';
import { ProductosService } from './productos.service';
import { Categoria } from '../../shared/interfaces/categoria.interface';
import { Producto } from '../../shared/interfaces/producto.interface';
import { PaginationMeta } from '../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-productos',
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
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  private categoriasService = inject(CategoriasService);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  displayedColumns: string[] = [
    'id',
    'codigo',
    'nombre',
    'categoria',
    'unidad',
    'stock_minimo',
    'lote',
    'vencimiento',
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
  loadingCategorias = false;
  errorMessage = '';
  successMessage = '';
  editingId: number | null = null;

  form = this.fb.group({
    categoria_id: [null as number | null, [Validators.required]],
    codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    descripcion: ['', [Validators.maxLength(1000)]],
    unidad_medida: ['UNIDAD', [Validators.required, Validators.maxLength(30)]],
    stock_minimo: [0, [Validators.required, Validators.min(0)]],
    requiere_lote: [true, [Validators.required]],
    requiere_vencimiento: [true, [Validators.required]]
  });

  ngOnInit(): void {
    this.loadCategorias();
    this.loadProductos();
  }

  get categoriaControl() {
    return this.form.get('categoria_id');
  }

  get codigoControl() {
    return this.form.get('codigo');
  }

  get nombreControl() {
    return this.form.get('nombre');
  }

  get descripcionControl() {
    return this.form.get('descripcion');
  }

  get unidadMedidaControl() {
    return this.form.get('unidad_medida');
  }

  get stockMinimoControl() {
    return this.form.get('stock_minimo');
  }

  loadCategorias(): void {
    this.loadingCategorias = true;

    this.categoriasService.findAll(1, 100).subscribe({
      next: (response) => {
        this.categorias = response.data.items.filter((item) => item.estado);
        this.loadingCategorias = false;
      },
      error: () => {
        this.loadingCategorias = false;
      }
    });
  }

  loadProductos(page = this.pagination.page, limit = this.pagination.limit): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productosService.findAll(page, limit).subscribe({
      next: (response) => {
        this.productos = response.data.items;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo cargar los productos';
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      categoria_id: Number(this.form.value.categoria_id),
      codigo: this.form.value.codigo?.trim() || '',
      nombre: this.form.value.nombre?.trim() || '',
      descripcion: this.form.value.descripcion?.trim() || '',
      unidad_medida: this.form.value.unidad_medida?.trim() || 'UNIDAD',
      stock_minimo: Number(this.form.value.stock_minimo ?? 0),
      requiere_lote: this.form.value.requiere_lote ?? true,
      requiere_vencimiento: this.form.value.requiere_vencimiento ?? true
    };

    const request$ = this.editingId
      ? this.productosService.update(this.editingId, payload)
      : this.productosService.create(payload);

    request$.subscribe({
      next: (response) => {
        this.successMessage =
          response.message ||
          (this.editingId
            ? 'Producto actualizado correctamente'
            : 'Producto creado correctamente');

        this.resetForm();
        this.loadProductos(this.pagination.page, this.pagination.limit);
        this.saving = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo guardar el producto';
        this.saving = false;
      }
    });
  }

  editProducto(producto: Producto): void {
    this.editingId = producto.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.form.patchValue({
      categoria_id: producto.categoria_id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      unidad_medida: producto.unidad_medida,
      stock_minimo: Number(producto.stock_minimo),
      requiere_lote: producto.requiere_lote,
      requiere_vencimiento: producto.requiere_vencimiento
    });
  }

  removeProducto(producto: Producto): void {
    const confirmed = window.confirm(
      `¿Deseas desactivar el producto "${producto.nombre}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.productosService.remove(producto.id).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || 'Producto desactivado correctamente';
        this.loadProductos(this.pagination.page, this.pagination.limit);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo desactivar el producto';
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      categoria_id: null,
      codigo: '',
      nombre: '',
      descripcion: '',
      unidad_medida: 'UNIDAD',
      stock_minimo: 0,
      requiere_lote: true,
      requiere_vencimiento: true
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadProductos(event.pageIndex + 1, event.pageSize);
  }
}