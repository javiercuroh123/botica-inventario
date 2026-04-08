import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiItemResponse,
  ApiPaginatedResponse
} from '../../shared/interfaces/pagination.interface';
import {
  Producto,
  ProductoRequest
} from '../../shared/interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/productos`;

  findAll(page = 1, limit = 10): Observable<ApiPaginatedResponse<Producto>> {
    return this.http.get<ApiPaginatedResponse<Producto>>(
      `${this.baseUrl}?page=${page}&limit=${limit}`
    );
  }

  findById(id: number): Observable<ApiItemResponse<Producto>> {
    return this.http.get<ApiItemResponse<Producto>>(`${this.baseUrl}/${id}`);
  }

  create(payload: ProductoRequest): Observable<ApiItemResponse<Producto>> {
    return this.http.post<ApiItemResponse<Producto>>(this.baseUrl, payload);
  }

  update(
    id: number,
    payload: ProductoRequest
  ): Observable<ApiItemResponse<Producto>> {
    return this.http.put<ApiItemResponse<Producto>>(
      `${this.baseUrl}/${id}`,
      payload
    );
  }

  remove(id: number): Observable<ApiItemResponse<Producto>> {
    return this.http.delete<ApiItemResponse<Producto>>(`${this.baseUrl}/${id}`);
  }
}