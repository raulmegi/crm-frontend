import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../app/model/customer.model';
import ConstUrls from '../app/shared/constants/const-urls';
import { ModelMap } from '../app/model/modelMap.model';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly API_BASE = ConstUrls.API_URL + '/cliente/';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http
      .get<ModelMap<Customer[]>>(`${this.API_BASE}todos`)
      .pipe(
        map(resp => {
          if (resp.type === 'OK') {
            return resp.data!;
          }
          throw resp.exception!;
        })
      );
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http
      .get<ModelMap<Customer>>(`${this.API_BASE}obtener/${id}`)
      .pipe(
        map(resp => {
          if (resp.type === 'OK') {
            return resp.data!;
          }
          throw resp.exception!;
        })
      );
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http
      .post<ModelMap<Customer>>(`${this.API_BASE}crearCliente`, customer)
      .pipe(
        map(resp => {
          if (resp.type === 'OK') {
            return resp.data!;
          }
          throw resp.exception!;
        })
      );
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http
      .put<ModelMap<Customer>>(`${this.API_BASE}actualizarCliente`, customer)
      .pipe(
        map(resp => {
          if (resp.type === 'OK') {
            return resp.data!;
          }
          throw resp.exception!;
        })
      );
  }

  deleteCustomer(id: number): Observable<boolean> {
    return this.http
      .delete<ModelMap<boolean>>(`${this.API_BASE}borrar/${id}`)
      .pipe(
        map(resp => {
          if (resp.type === 'OK') {
            return resp.data!;
          }
          throw resp.exception!;
        })
      );
  }
}