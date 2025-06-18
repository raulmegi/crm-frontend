import { HttpHeaders, HttpResponse } from '@angular/common/http';

const USUARIO_LOGADO_STORAGE = 'usuarioLogado';

export const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

// export function loadCredentials(): any {
//   const usuario = JSON.parse(localStorage.getItem(USUARIO_LOGADO_STORAGE));
//   if (usuario) {
//     return { usuarioId: usuario.id }; // o lo que uses como param
//   }
//   return {};
// }

/**
 * Envuelve una promesa en un try/catch, devolviendo [error, resultado]
 */
export default async function to(promise: Promise<any>) {
    try {
        const data = await promise
        return data
    } catch (err) {
        return [err]
    }
}

/**
 * Extrae el campo "data" de una respuesta del backend
 */
export function loadResponseData(response: HttpResponse<any>): any {
  return response?.body?.data ?? null;
}

/**
 * Extrae un mensaje de error (excepción) del backend
 */
export function loadResponseError(response: HttpResponse<any> | any): string {
  if (response?.body?.exception?.mensajeDeError) {
    return response.body.exception.mensajeDeError;
  }
  return 'Error desconocido';
}

/**
 * Indica si la respuesta fue satisfactoria (type === "OK")
 */
export function isOkResponse(response: HttpResponse<any>): boolean {
  return response?.body?.type === 'OK';
}

/**
 * Obtiene el usuario logado desde localStorage
 */
// export function obtenerUsuarioLogado(): any {
//   return JSON.parse(localStorage.getItem(USUARIO_LOGADO_STORAGE));
// }
