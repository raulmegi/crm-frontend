import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { toTuple, headers } from './utils.service';
import { AppUser } from '../app/model/appUser.model';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppUserManagerService {
  private APPUSER_URL = ConstUrls.API_URL + '/appUser';

  constructor(private http: HttpClient) {}

   async getAllAppUsers() {
    return await to(
      this.http.get<any[]>(`${this.APPUSER_URL}/obtenerTodosAppUser`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }
 
  async getAppUserById(id: number) {
    if (!id || id === 0 || typeof id !== 'number') {
    return [new Error('Invalid ID'), null];
  }
    return await to(
      this.http.get<any>(`${this.APPUSER_URL}/obtenerAppUserById/${id}`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async getAppUserByEmail(email: string) {
    if (!email || typeof email !== 'string') {
      return [new Error('Invalid email'), null];
    }
    return await to(
      this.http.get<any>(`${this.APPUSER_URL}/obtenerAppUserByEmail/${encodeURIComponent(email)}`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async getAppUserByName(name: string) {
    if (!name || typeof name !== 'string') {
      return [new Error('Invalid name'), null];
    }
    return await to(
      this.http.get<any>(`${this.APPUSER_URL}/obtenerAppUserByName?name=${encodeURIComponent(name)}`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async updateAppUser(id: number, appUser: AppUser) {
    if (!id || id === 0 || typeof id !== 'number') {
      return [new Error('Invalid ID'), null];
    }
    const result = await to(
      firstValueFrom(
        this.http.put<any>(`${this.APPUSER_URL}/actualizarAppUser/${id}`, appUser, {
          headers,
          observe: 'response',
        })
      )
    );

   if (Array.isArray(result)) {
    return [result[0], null];
  } else {
    return [null, result];
  }
}

  async deleteAppUserById(id: number): Promise<[any, any]> {
    if (!id || typeof id !== 'number') {
      return [new Error('Invalid ID'), null];
    }
  
    const result = await to(
      firstValueFrom(
        this.http.delete<any>(`${this.APPUSER_URL}/eliminarAppUser/${id}`, {
          headers,
          observe: 'response',
        })
      )
    );
  
    if (Array.isArray(result)) {
      return [result[0], null];
    } else {
      return [null, result];
    }
  }
  
 async createAppUser(userData: { appUser: AppUser }) {

  const result = await to(
    firstValueFrom(
      this.http.post(`${ConstUrls.API_URL}/appUser/crearAppUser`, userData.appUser, {
        headers: headers,
        observe: 'response',
      })
    )
  );

  if (Array.isArray(result)) {
    return [result[0], null];
  } else {
    return [null, result];
  }
}
}