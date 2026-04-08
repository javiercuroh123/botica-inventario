import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayloadData {
  id: number;
  correo: string;
  rol: string;
}

export function generateToken(payload: JwtPayloadData): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  } as jwt.SignOptions);
}