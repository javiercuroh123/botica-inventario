import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ComprasService } from './compras.service';
import { CompraConDetalles } from '../../shared/interfaces/compra.interface';

@Component({
  selector: 'app-compra-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './compra-detalle.component.html',
  styleUrl: './compra-detalle.component.scss'
})
export class CompraDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comprasService = inject(ComprasService);

  loading = true;
  errorMessage = '';
  compra: CompraConDetalles | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'ID de compra inválido';
      this.loading = false;
      return;
    }

    this.loadCompra(id);
  }

  loadCompra(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.comprasService.findById(id).subscribe({
      next: (response) => {
        this.compra = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo cargar el detalle de la compra';
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/compras']);
  }
}