export interface Contact {
  id?: number;
  name: string;
  phone: string;
  email?: string; // formato yyyy-MM-dd
  charge?: string;
  customer?: { id: number; name: string};
 sector?: { id: number; name: string };
  chain?: { id: number; name: string };
  zone?: { id: number; name: string };
}
