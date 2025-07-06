import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { headers } from './utils.service';
import { AppUser } from '../app/model/appUser.model';
import { ModelMap } from '../app/model/modelMap.model';
import { isOkResponse, loadResponseData } from './utils.service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private REGISTER_URL = ConstUrls.API_URL + '/appUser/registro';
  private LOGIN_URL = ConstUrls.API_URL + '/appUser/login';
  private LOGOUT_URL = ConstUrls.API_URL + '/appUser/logout';
  private ROLES_URL = ConstUrls.API_URL + '/roles';
  private CURRENT_APPUSER_URL = ConstUrls.API_URL + '/appUser/me';

  private currentUser: AppUser | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  async registerAppUser(userData: { name: string; email: string; password: string }) {
    const result = await to(firstValueFrom(
      this.http.post<any>(this.REGISTER_URL, userData, {
        headers,
        observe: 'response',
      })
    ));
    return Array.isArray(result) ? [result[0], null] : [null, result];
  }

  async login(credentials: { email: string; password: string }) {
    const result = await to(
      this.http.post<HttpResponse<any>>(this.LOGIN_URL, credentials, {
        withCredentials: true,
        headers,
        observe: 'response',
      }).toPromise()
    );
    return Array.isArray(result) ? [result[0], null] : [null, result];
  }

  async getLoggedUser(): Promise<AppUser | null> {
    try {
      const response = await this.http.get<any>(this.CURRENT_APPUSER_URL, {
        withCredentials: true,
        observe: 'response'
      }).toPromise();

      if (response?.body?.type === 'OK') {
        return response.body.data as AppUser;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching logged user:', error);
      return null;
    }
  }

  async logout() {
    try {
      await this.http.post(this.LOGOUT_URL, {}, { withCredentials: true }).toPromise();
      this.currentUser = null;
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Error al cerrar sesión', err);
      alert('Error al cerrar sesión. Por favor, inténtelo de nuevo más tarde.');
    }
  }

  getAllRoles(): Promise<[any, any]> {
    return to(this.http.get(this.ROLES_URL).toPromise());
  }

  getCurrentUser(): AppUser | null {
    return this.currentUser;
  }
}
