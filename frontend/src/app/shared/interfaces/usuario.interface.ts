export interface UsuarioSistema {
  id: number;
  rol_id?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  estado: boolean;
  created_at: string;
  rol: string;
}

export interface UsuarioCreateRequest {
  rol_id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  password: string;
}

export interface UsuariosListResponse {
  ok: boolean;
  data: UsuarioSistema[];
}