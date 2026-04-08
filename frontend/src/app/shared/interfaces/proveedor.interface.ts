export interface Proveedor {
  id: number;
  razon_social: string;
  ruc: string;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  contacto: string | null;
  estado: boolean;
  created_at: string;
}

export interface ProveedorRequest {
  razon_social: string;
  ruc: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  contacto?: string;
}