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
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CategoriasService } from './categorias.service';
import { Categoria } from '../../shared/interfaces/categoria.interface';
import { PaginationMeta } from '../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoriasService = inject(CategoriasService);

  categorias: Categoria[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'estado', 'acciones'];

  pagination: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  };

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  editingId: number | null = null;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(255)]]
  });

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(page = this.pagination.page, limit = this.pagination.limit): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.categoriasService.findAll(page, limit).subscribe({
      next: (response) => {
        this.categorias = response.data.items;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo cargar las categorías';
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
      nombre: this.form.value.nombre?.trim() || '',
      descripcion: this.form.value.descripcion?.trim() || ''
    };

    const request$ = this.editingId
      ? this.categoriasService.update(this.editingId, payload)
      : this.categoriasService.create(payload);

    request$.subscribe({
      next: (response) => {
        this.successMessage =
          response.message ||
          (this.editingId
            ? 'Categoría actualizada correctamente'
            : 'Categoría creada correctamente');

        this.resetForm();
        this.loadCategorias(this.pagination.page, this.pagination.limit);
        this.saving = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo guardar la categoría';
        this.saving = false;
      }
    });
  }

  editCategoria(categoria: Categoria): void {
    this.editingId = categoria.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.form.patchValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    });
  }

  removeCategoria(categoria: Categoria): void {
    const confirmed = window.confirm(
      `¿Deseas desactivar la categoría "${categoria.nombre}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.categoriasService.remove(categoria.id).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || 'Categoría desactivada correctamente';
        this.loadCategorias(this.pagination.page, this.pagination.limit);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo desactivar la categoría';
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      nombre: '',
      descripcion: ''
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadCategorias(event.pageIndex + 1, event.pageSize);
  }

  get nombreControl() {
    return this.form.get('nombre');
  }

  get descripcionControl() {
    return this.form.get('descripcion');
  }
}