export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
  message: string;
  data: {
    token: string;
    usuario: {
      id: number;
      nombres: string;
      apellidos: string;
      correo: string;
      rol: string;
    };
  };
}