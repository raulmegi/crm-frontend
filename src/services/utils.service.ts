import { HttpHeaders, HttpResponse } from '@angular/common/http';

const USUARIO_LOGADO_STORAGE = 'usuarioLogado';

export const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

export default async function to(promise: Promise<any>) {
    try {
        const data = await promise
        return data
    } catch (err) {
        return [err]
    }
}

export async function toTuple<T>(promise: Promise<T>): Promise<[any, T | null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    return [err, null];
  }
}

export function loadResponseData(response: HttpResponse<any>): any {
  return response?.body?.data ?? null;
}

export function loadResponseError(response: HttpResponse<any> | any): string {
  if (response?.body?.exception?.mensajeDeError) {
    return response.body.exception.mensajeDeError;
  }
  return 'Error desconocido';
}

export function isOkResponse(response: HttpResponse<any>): boolean {
  return response?.body?.type === 'OK';
}
