import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../app/model/role.model';
import { firstValueFrom, Observable } from 'rxjs';
import to, { headers } from './utils.service';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:8081/roles'; 

  constructor(private http: HttpClient) {}

  getAllRoles1(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

async getAllRoles() {
        return await to(firstValueFrom(
            this.http
                .get<Role[]>(this.apiUrl, {
                    headers: headers,
                    // params: loadCredentials(),
                    withCredentials: true,
                    observe: "response",
                 })
      )
    );
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }
}
