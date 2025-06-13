export interface Customer {
  id: number;
  name: string;
  cif?: string;
  phone?: string;   
  email?: string;
  address?: string;
  sector?: { id: number };
  chain?: { id: number };
  zone?: { id: number };
}