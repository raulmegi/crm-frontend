import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { headers } from './utils.service'; 
import { AppUser } from '../app/model/appUser.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private REGISTER_URL = ConstUrls.API_URL + '/appUser/crearAppUser';
  private LOGIN_URL = ConstUrls.API_URL + '/appUser/login';


  constructor(private http: HttpClient) {}

  async createAppUser(userData: { name: string; email: string; password: string }) {
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
}
