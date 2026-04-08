import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiItemResponse,
  ApiPaginatedResponse
} from '../../shared/interfaces/pagination.interface';
import {
  Categoria,
  CategoriaRequest
} from '../../shared/interfaces/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/categorias`;

  findAll(page = 1, limit = 10): Observable<ApiPaginatedResponse<Categoria>> {
    return this.http.get<ApiPaginatedResponse<Categoria>>(
      `${this.baseUrl}?page=${page}&limit=${limit}`
    );
  }

  findById(id: number): Observable<ApiItemResponse<Categoria>> {
    return this.http.get<ApiItemResponse<Categoria>>(`${this.baseUrl}/${id}`);
  }

  create(payload: CategoriaRequest): Observable<ApiItemResponse<Categoria>> {
    return this.http.post<ApiItemResponse<Categoria>>(this.baseUrl, payload);
  }

  update(
    id: number,
    payload: CategoriaRequest
  ): Observable<ApiItemResponse<Categoria>> {
    return this.http.put<ApiItemResponse<Categoria>>(
      `${this.baseUrl}/${id}`,
      payload
    );
  }

  remove(id: number): Observable<ApiItemResponse<Categoria>> {
    return this.http.delete<ApiItemResponse<Categoria>>(`${this.baseUrl}/${id}`);
  }
}