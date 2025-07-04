export interface Contact {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  charge?: string;
  customer?: { id: number; name: string};
  }
