import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiItemResponse, ApiPaginatedResponse } from '../../shared/interfaces/pagination.interface';
import { Movimiento, MovimientoFilters } from '../../shared/interfaces/movimiento.interface';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/movimientos`;

  findAll(filters: MovimientoFilters = {}): Observable<ApiPaginatedResponse<Movimiento>> {
    let params = new HttpParams();

    if (filters.page) {
      params = params.set('page', String(filters.page));
    }

    if (filters.limit) {
      params = params.set('limit', String(filters.limit));
    }

    if (filters.producto_id) {
      params = params.set('producto_id', String(filters.producto_id));
    }

    if (filters.lote_id) {
      params = params.set('lote_id', String(filters.lote_id));
    }

    if (filters.tipo_movimiento) {
      params = params.set('tipo_movimiento', filters.tipo_movimiento);
    }

    if (filters.fecha_desde) {
      params = params.set('fecha_desde', filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      params = params.set('fecha_hasta', filters.fecha_hasta);
    }

    return this.http.get<ApiPaginatedResponse<Movimiento>>(this.baseUrl, { params });
  }

  findById(id: number): Observable<ApiItemResponse<Movimiento>> {
    return this.http.get<ApiItemResponse<Movimiento>>(`${this.baseUrl}/${id}`);
  }
}