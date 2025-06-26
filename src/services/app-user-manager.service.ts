// src/app/services/app-user-manager.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { toTuple, headers } from './utils.service';
import { AppUser } from '../app/model/appUser.model';
import { Router } from '@angular/router';

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
    return await to(
      this.http.put<any>(`${this.APPUSER_URL}/actualizarAppUser/${id}`, appUser, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async deleteAppUserById(id: number) {
    if (!id || id === 0 || typeof id !== 'number') {
      return [new Error('Invalid ID'), null];
    }
    return await to(
      this.http.delete<any>(`${this.APPUSER_URL}/eliminarAppUser/${id}`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }
async createAppUser(userData: { name: string; email: string; password: string }) {
      console.log('Sending user data to backend:', userData); // Add this line

    const result = await to(
      this.http.post(`${ConstUrls.API_URL}/appUser/crearAppUser`, userData, {
        withCredentials: true,
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

}