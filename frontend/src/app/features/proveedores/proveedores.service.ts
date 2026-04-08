import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiItemResponse,
  ApiPaginatedResponse
} from '../../shared/interfaces/pagination.interface';
import {
  Proveedor,
  ProveedorRequest
} from '../../shared/interfaces/proveedor.interface';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/proveedores`;

  findAll(page = 1, limit = 10): Observable<ApiPaginatedResponse<Proveedor>> {
    return this.http.get<ApiPaginatedResponse<Proveedor>>(
      `${this.baseUrl}?page=${page}&limit=${limit}`
    );
  }

  findById(id: number): Observable<ApiItemResponse<Proveedor>> {
    return this.http.get<ApiItemResponse<Proveedor>>(`${this.baseUrl}/${id}`);
  }

  create(payload: ProveedorRequest): Observable<ApiItemResponse<Proveedor>> {
    return this.http.post<ApiItemResponse<Proveedor>>(this.baseUrl, payload);
  }

  update(
    id: number,
    payload: ProveedorRequest
  ): Observable<ApiItemResponse<Proveedor>> {
    return this.http.put<ApiItemResponse<Proveedor>>(
      `${this.baseUrl}/${id}`,
      payload
    );
  }

  remove(id: number): Observable<ApiItemResponse<Proveedor>> {
    return this.http.delete<ApiItemResponse<Proveedor>>(`${this.baseUrl}/${id}`);
  }
}