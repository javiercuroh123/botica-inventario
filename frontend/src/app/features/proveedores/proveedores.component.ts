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
import { ProveedoresService } from './proveedores.service';
import { Proveedor } from '../../shared/interfaces/proveedor.interface';
import { PaginationMeta } from '../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-proveedores',
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
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.scss'
})
export class ProveedoresComponent implements OnInit {
  private fb = inject(FormBuilder);
  private proveedoresService = inject(ProveedoresService);

  proveedores: Proveedor[] = [];
  displayedColumns: string[] = [
    'id',
    'razon_social',
    'ruc',
    'telefono',
    'correo',
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
  errorMessage = '';
  successMessage = '';
  editingId: number | null = null;

  form = this.fb.group({
    razon_social: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(200)]
    ],
    ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    telefono: ['', [Validators.maxLength(20)]],
    correo: ['', [Validators.email, Validators.maxLength(150)]],
    direccion: ['', [Validators.maxLength(255)]],
    contacto: ['', [Validators.maxLength(150)]]
  });

  ngOnInit(): void {
    this.loadProveedores();
  }

  get razonSocialControl() {
    return this.form.get('razon_social');
  }

  get rucControl() {
    return this.form.get('ruc');
  }

  get telefonoControl() {
    return this.form.get('telefono');
  }

  get correoControl() {
    return this.form.get('correo');
  }

  get direccionControl() {
    return this.form.get('direccion');
  }

  get contactoControl() {
    return this.form.get('contacto');
  }

  loadProveedores(page = this.pagination.page, limit = this.pagination.limit): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.proveedoresService.findAll(page, limit).subscribe({
      next: (response) => {
        this.proveedores = response.data.items;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo cargar los proveedores';
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
      razon_social: this.form.value.razon_social?.trim() || '',
      ruc: this.form.value.ruc?.trim() || '',
      telefono: this.form.value.telefono?.trim() || '',
      correo: this.form.value.correo?.trim() || '',
      direccion: this.form.value.direccion?.trim() || '',
      contacto: this.form.value.contacto?.trim() || ''
    };

    const request$ = this.editingId
      ? this.proveedoresService.update(this.editingId, payload)
      : this.proveedoresService.create(payload);

    request$.subscribe({
      next: (response) => {
        this.successMessage =
          response.message ||
          (this.editingId
            ? 'Proveedor actualizado correctamente'
            : 'Proveedor creado correctamente');

        this.resetForm();
        this.loadProveedores(this.pagination.page, this.pagination.limit);
        this.saving = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo guardar el proveedor';
        this.saving = false;
      }
    });
  }

  editProveedor(proveedor: Proveedor): void {
    this.editingId = proveedor.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.form.patchValue({
      razon_social: proveedor.razon_social,
      ruc: proveedor.ruc,
      telefono: proveedor.telefono || '',
      correo: proveedor.correo || '',
      direccion: proveedor.direccion || '',
      contacto: proveedor.contacto || ''
    });
  }

  removeProveedor(proveedor: Proveedor): void {
    const confirmed = window.confirm(
      `¿Deseas desactivar el proveedor "${proveedor.razon_social}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.proveedoresService.remove(proveedor.id).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || 'Proveedor desactivado correctamente';
        this.loadProveedores(this.pagination.page, this.pagination.limit);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo desactivar el proveedor';
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      razon_social: '',
      ruc: '',
      telefono: '',
      correo: '',
      direccion: '',
      contacto: ''
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadProveedores(event.pageIndex + 1, event.pageSize);
  }
}