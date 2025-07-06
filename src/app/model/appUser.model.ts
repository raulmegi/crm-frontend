import { Role } from './role.model';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role | null;
}
