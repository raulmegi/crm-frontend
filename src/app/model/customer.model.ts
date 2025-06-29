export interface Customer {
  id: number;
  name: string;
  cif?: string;
  phone?: string;   
  email?: string;
  address?: string;
  sector?: { id: number; name: string };
  chain?: { id: number; name: string };
  zone?: { id: number; name: string };
}