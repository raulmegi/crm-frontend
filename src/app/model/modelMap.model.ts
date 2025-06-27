export interface ModelMap<T> {
  type: 'OK' | 'exception' | string;
  data: T | null;
  exception: {
    codigoDeError: number;
    mensajeDeError: string;
  } | null;
}