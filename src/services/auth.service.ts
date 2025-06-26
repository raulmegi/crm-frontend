import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { headers } from './utils.service'; 
import { AppUser } from '../app/model/appUser.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private REGISTER_URL = ConstUrls.API_URL + '/appUser/registro';
  private LOGIN_URL = ConstUrls.API_URL + '/appUser/login';
  private LOGOUT_URL = ConstUrls.API_URL + '/appUser/logout';
  private ROLES_URL = ConstUrls.API_URL + '/roles';

  constructor(private http: HttpClient, private router: Router) {}

  async registerAppUser(userData: { name: string; email: string; password: string }) {
    const result = await to(
      this.http.post<any>(`${this.REGISTER_URL}`, userData, {
        headers: headers,
        observe: 'response',
      }).toPromise()
    );
    if (Array.isArray(result)) {
    return [result[0], null];
  } else {
    return [null, result];
  }
  }


  async login(credentials: { email: string; password: string }) {
  const result = await to(
    this.http.post<HttpResponse<any>>(`${this.LOGIN_URL}`, credentials, {
      withCredentials: true,
      headers,
      observe: 'response',
    }).toPromise()
  );

  if (Array.isArray(result)) {
    return [result[0], null];
  } else {
    return [null, result];
  }
}
  async logout() {
    try {
      await this.http.post(this.LOGOUT_URL, {}, { withCredentials: true }).toPromise();
      console.log('Sesión cerrada correctamente');
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Error al cerrar sesión', err);
      alert('Error al cerrar sesión. Por favor, inténtelo de nuevo más tarde.');
    }
  }   
  getAllRoles(): Promise<[any, any]> {
  return to(this.http.get(`${this.ROLES_URL}`).toPromise());
}
}