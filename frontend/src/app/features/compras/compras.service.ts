import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiItemResponse,
  ApiPaginatedResponse
} from '../../shared/interfaces/pagination.interface';
import {
  Compra,
  CompraDetailResponse,
  CompraRequest
} from '../../shared/interfaces/compra.interface';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/compras`;

  findAll(page = 1, limit = 10): Observable<ApiPaginatedResponse<Compra>> {
    return this.http.get<ApiPaginatedResponse<Compra>>(
      `${this.baseUrl}?page=${page}&limit=${limit}`
    );
  }

  findById(id: number): Observable<CompraDetailResponse> {
    return this.http.get<CompraDetailResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: CompraRequest): Observable<ApiItemResponse<Compra>> {
    return this.http.post<ApiItemResponse<Compra>>(this.baseUrl, payload);
  }
}