import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Rol } from '../../shared/interfaces/rol.interface';
import { RolesService } from './roles.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatPaginatorModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit, AfterViewInit {
  private rolesService = inject(RolesService);

  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'estado'];
  dataSource = new MatTableDataSource<Rol>([]);

  loading = false;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadRoles();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadRoles(): void {
    this.loading = true;
    this.errorMessage = '';

    this.rolesService.findAll().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo cargar los roles';
        this.loading = false;
      }
    });
  }
}