import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RolesService } from '../roles/roles.service';
import { UsuariosService } from './usuarios.service';
import { Rol } from '../../shared/interfaces/rol.interface';
import {
  UsuarioCreateRequest,
  UsuarioSistema
} from '../../shared/interfaces/usuario.interface';

@Component({
  selector: 'app-usuarios',
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
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private rolesService = inject(RolesService);

  roles: Rol[] = [];
  displayedColumns: string[] = [
    'id',
    'nombres',
    'apellidos',
    'correo',
    'rol',
    'estado'
  ];
  dataSource = new MatTableDataSource<UsuarioSistema>([]);

  loading = false;
  loadingRoles = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form = this.fb.group({
    rol_id: [null as number | null, [Validators.required]],
    nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
  });

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  get rolControl() {
    return this.form.get('rol_id');
  }

  get nombresControl() {
    return this.form.get('nombres');
  }

  get apellidosControl() {
    return this.form.get('apellidos');
  }

  get correoControl() {
    return this.form.get('correo');
  }

  get passwordControl() {
    return this.form.get('password');
  }

  loadInitialData(): void {
    this.loading = true;
    this.loadingRoles = true;
    this.errorMessage = '';

    forkJoin({
      usuarios: this.usuariosService.findAll(),
      roles: this.rolesService.findAll()
    }).subscribe({
      next: ({ usuarios, roles }) => {
        this.dataSource.data = usuarios.data;
        this.roles = roles.data.filter((item) => item.estado);
        this.loading = false;
        this.loadingRoles = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo cargar usuarios y roles';
        this.loading = false;
        this.loadingRoles = false;
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

    const payload: UsuarioCreateRequest = {
      rol_id: Number(this.form.value.rol_id),
      nombres: this.form.value.nombres?.trim() || '',
      apellidos: this.form.value.apellidos?.trim() || '',
      correo: this.form.value.correo?.trim() || '',
      password: this.form.value.password?.trim() || ''
    };

    this.usuariosService.create(payload).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Usuario creado correctamente';
        this.resetForm();
        this.loadInitialData();
        this.saving = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo crear el usuario';
        this.saving = false;
      }
    });
  }

  resetForm(): void {
    this.form.reset({
      rol_id: null,
      nombres: '',
      apellidos: '',
      correo: '',
      password: ''
    });
  }
}