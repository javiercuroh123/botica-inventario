export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  created_at: string;
}

export interface CategoriaRequest {
  nombre: string;
  descripcion?: string;
}