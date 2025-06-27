import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ConstRoutes from '../../shared/constants/const-routes';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { Customer } from '../../model/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { CustomerPopupComponent } from '../customer-popup/customer-popup.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, CustomerPopupComponent]
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  customerSelected?: Customer;
  error = '';
  modePopup: 'CLOSED' | 'CREAR' | 'ACTUALIZAR' = 'CLOSED';

  constructor(private customerService: CustomerService, private router: Router) {}

  async ngOnInit() {
    await this.loadCustomers();
  }

  private async loadCustomers() {
    this.error = '';
    try {
      const customers = await this.customerService.getCustomers().toPromise();
      this.customers = customers ?? [];
      this.customerSelected = this.customers[0];
    } catch (err: any) {
      console.error('Error cargando clientes', err);
      this.error = err?.mensajeDeError || 'Error cargando clientes.';
      this.customers = [];
      this.customerSelected = undefined;
    }
  }

  onLogOut() {
    localStorage.clear();
    this.router.navigate(['/' + ConstRoutes.PATH_LOGIN]);
  }

  async createCustomer() {
    this.modePopup = 'CREAR';
  }

  async updateCustomer() {
    if (this.customerSelected) {
      this.modePopup = 'ACTUALIZAR';
    }
  }

  async deleteCustomer() {
    this.error = '';
    if (this.customerSelected?.id) {
      if (confirm(`¿Borrar al cliente ${this.customerSelected.name}?`)) {
        try {
          await this.customerService.deleteCustomer(this.customerSelected.id).toPromise();
          await this.loadCustomers();
          this.customerSelected = this.customers[0];
        } catch (err: any) {
          console.error('Error al borrar cliente', err);
          this.error = err?.mensajeDeError || 'Error al borrar el cliente.';
        }
      }
    }
  }

  onClosePopupOk() {
    this.modePopup = 'CLOSED';
    this.loadCustomers();
  }

  onClosePopupCancel() {
    this.modePopup = 'CLOSED';
  }
}