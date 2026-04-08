import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiItemResponse,
  ApiPaginatedResponse
} from '../../shared/interfaces/pagination.interface';
import {
  Lote,
  LoteRequest
} from '../../shared/interfaces/lote.interface';

@Injectable({
  providedIn: 'root'
})
export class LotesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/lotes`;

  findAll(page = 1, limit = 10): Observable<ApiPaginatedResponse<Lote>> {
    return this.http.get<ApiPaginatedResponse<Lote>>(
      `${this.baseUrl}?page=${page}&limit=${limit}`
    );
  }

  findById(id: number): Observable<ApiItemResponse<Lote>> {
    return this.http.get<ApiItemResponse<Lote>>(`${this.baseUrl}/${id}`);
  }

  create(payload: LoteRequest): Observable<ApiItemResponse<Lote>> {
    return this.http.post<ApiItemResponse<Lote>>(this.baseUrl, payload);
  }

  update(id: number, payload: LoteRequest): Observable<ApiItemResponse<Lote>> {
    return this.http.put<ApiItemResponse<Lote>>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number): Observable<ApiItemResponse<Lote>> {
    return this.http.delete<ApiItemResponse<Lote>>(`${this.baseUrl}/${id}`);
  }
}