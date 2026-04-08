import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiItemResponse } from '../../shared/interfaces/pagination.interface';
import {
  UsuarioCreateRequest,
  UsuarioSistema,
  UsuariosListResponse
} from '../../shared/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/usuarios`;

  findAll(): Observable<UsuariosListResponse> {
    return this.http.get<UsuariosListResponse>(this.baseUrl);
  }

  create(payload: UsuarioCreateRequest): Observable<ApiItemResponse<UsuarioSistema>> {
    return this.http.post<ApiItemResponse<UsuarioSistema>>(this.baseUrl, payload);
  }
}