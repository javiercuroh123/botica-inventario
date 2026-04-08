import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
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
import { ProveedoresService } from '../proveedores/proveedores.service';
import { ProductosService } from '../productos/productos.service';
import { ComprasService } from './compras.service';
import { Proveedor } from '../../shared/interfaces/proveedor.interface';
import { Producto } from '../../shared/interfaces/producto.interface';
import { Compra } from '../../shared/interfaces/compra.interface';
import { PaginationMeta } from '../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule
  ],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.scss'
})
export class ComprasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private comprasService = inject(ComprasService);
  private proveedoresService = inject(ProveedoresService);
  private productosService = inject(ProductosService);

  compras: Compra[] = [];
  proveedores: Proveedor[] = [];
  productos: Producto[] = [];
  displayedColumns: string[] = [
    'id',
    'fecha',
    'comprobante',
    'proveedor',
    'total',
    'usuario',
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
  loadingRefs = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.group({
    proveedor_id: [null as number | null, [Validators.required]],
    fecha_compra: [new Date().toISOString().slice(0, 10), [Validators.required]],
    tipo_comprobante: [
      'FACTURA',
      [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
    ],
    numero_comprobante: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
    ],
    observacion: ['', [Validators.maxLength(1000)]],
    detalles: this.fb.array([this.createDetalleGroup()])
  });

  readonly totalCalculado = computed(() => {
    return this.detalles.controls.reduce((acc, group) => {
      const cantidad = Number(group.get('cantidad')?.value ?? 0);
      const precio = Number(group.get('precio_unitario')?.value ?? 0);
      return acc + cantidad * precio;
    }, 0);
  });

  ngOnInit(): void {
    this.loadRefs();
    this.loadCompras();
  }

  get detalles(): FormArray<FormGroup> {
    return this.form.get('detalles') as FormArray<FormGroup>;
  }

  get proveedorControl() {
    return this.form.get('proveedor_id');
  }

  get fechaCompraControl() {
    return this.form.get('fecha_compra');
  }

  get tipoComprobanteControl() {
    return this.form.get('tipo_comprobante');
  }

  get numeroComprobanteControl() {
    return this.form.get('numero_comprobante');
  }

  get observacionControl() {
    return this.form.get('observacion');
  }

  createDetalleGroup(): FormGroup {
    return this.fb.group({
      producto_id: [null as number | null, [Validators.required]],
      numero_lote: ['', [Validators.maxLength(100)]],
      fecha_vencimiento: [''],
      cantidad: [1, [Validators.required, Validators.min(0.01)]],
      precio_unitario: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addDetalle(): void {
    this.detalles.push(this.createDetalleGroup());
  }

  removeDetalle(index: number): void {
    if (this.detalles.length === 1) {
      return;
    }

    this.detalles.removeAt(index);
  }

  getDetalleSubtotal(index: number): number {
    const group = this.detalles.at(index);
    const cantidad = Number(group.get('cantidad')?.value ?? 0);
    const precio = Number(group.get('precio_unitario')?.value ?? 0);
    return cantidad * precio;
  }

  loadRefs(): void {
    this.loadingRefs = true;

    forkJoin({
      proveedores: this.proveedoresService.findAll(1, 100),
      productos: this.productosService.findAll(1, 100)
    }).subscribe({
      next: ({ proveedores, productos }) => {
        this.proveedores = proveedores.data.items.filter((item) => item.estado);
        this.productos = productos.data.items.filter((item) => item.estado);
        this.loadingRefs = false;
      },
      error: () => {
        this.loadingRefs = false;
      }
    });
  }

  loadCompras(page = this.pagination.page, limit = this.pagination.limit): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.comprasService.findAll(page, limit).subscribe({
      next: (response) => {
        this.compras = response.data.items;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo cargar las compras';
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.detalles.markAllAsTouched();
      return;
    }

    const detalles = this.detalles.controls.map((group) => ({
      producto_id: Number(group.get('producto_id')?.value),
      numero_lote: String(group.get('numero_lote')?.value || '').trim(),
      fecha_vencimiento: String(group.get('fecha_vencimiento')?.value || '').trim(),
      cantidad: Number(group.get('cantidad')?.value ?? 0),
      precio_unitario: Number(group.get('precio_unitario')?.value ?? 0)
    }));

    if (detalles.some((item) => item.cantidad <= 0)) {
      this.errorMessage = 'Todas las cantidades deben ser mayores que 0';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      proveedor_id: Number(this.form.value.proveedor_id),
      fecha_compra: this.form.value.fecha_compra || '',
      tipo_comprobante: this.form.value.tipo_comprobante?.trim() || '',
      numero_comprobante: this.form.value.numero_comprobante?.trim() || '',
      observacion: this.form.value.observacion?.trim() || '',
      detalles
    };

    this.comprasService.create(payload).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || 'Compra registrada correctamente';
        this.resetForm();
        this.loadCompras(this.pagination.page, this.pagination.limit);
        this.saving = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo registrar la compra';
        this.saving = false;
      }
    });
  }

  resetForm(): void {
    while (this.detalles.length > 1) {
      this.detalles.removeAt(this.detalles.length - 1);
    }

    this.detalles.at(0).reset({
      producto_id: null,
      numero_lote: '',
      fecha_vencimiento: '',
      cantidad: 1,
      precio_unitario: 0
    });

    this.form.reset({
      proveedor_id: null,
      fecha_compra: new Date().toISOString().slice(0, 10),
      tipo_comprobante: 'FACTURA',
      numero_comprobante: '',
      observacion: ''
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadCompras(event.pageIndex + 1, event.pageSize);
  }
}