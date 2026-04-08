export interface Rol {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  created_at: string;
}

export interface RolesListResponse {
  ok: boolean;
  data: Rol[];
}