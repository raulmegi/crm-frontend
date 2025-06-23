import { Role } from './role.model';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  // Avoid exposing password in frontend models for security reasons.
  password: string;
  role: Role | null;
}
