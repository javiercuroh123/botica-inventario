import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rol, RolesListResponse } from '../../shared/interfaces/rol.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/roles`;

  findAll(): Observable<RolesListResponse> {
    return this.http.get<RolesListResponse>(this.baseUrl);
  }
}