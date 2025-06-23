import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../app/model/customer.model';



@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/cliente';

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl + '/todos');
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/obtener/${id}`);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(this.apiUrl+ '/actualizarCliente', customer );
  }
  

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl+ '/crearCliente', customer );
  }

  deleteCustomer(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/borrar/${id}`);
  }
}