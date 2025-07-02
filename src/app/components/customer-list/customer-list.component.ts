import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, startWith, map } from 'rxjs/operators';

import ConstRoutes from '../../shared/constants/const-routes';
import { Customer } from '../../model/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { CustomerPopupComponent } from '../customer-popup/customer-popup.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    CustomerPopupComponent,
  ],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];

  searchControl = new FormControl('');
  customerSelected?: Customer;
  error = '';
  modePopup: 'CLOSED' | 'CREAR' | 'ACTUALIZAR' = 'CLOSED';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  async ngOnInit() {
    // 1) Cargo todos los clientes
    await this.loadCustomers();

    // 2) Inicializo filtrado
    this.filteredCustomers = this.customers;
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        startWith(''),
        map((v) => (v ?? '').toLowerCase().trim())
      )
      .subscribe((term) => {
        this.filteredCustomers = this.customers.filter((c) =>
          c.name.toLowerCase().includes(term)
        );
        // Opcional: si quieres re-seleccionar el primero tras filtrar:
        this.customerSelected = this.filteredCustomers[0];
      });
  }

  private async loadCustomers() {
    this.error = '';
    try {
      const list = await this.customerService.getCustomers().toPromise();
      this.customers = list ?? [];
      this.filteredCustomers = this.customers;
      this.customerSelected = this.customers[0];
    } catch (err: any) {
      console.error('Error cargando clientes', err);
      this.error = err?.mensajeDeError || 'Error cargando clientes.';
      this.customers = [];
      this.filteredCustomers = [];
      this.customerSelected = undefined;
    }
  }

  onLogOut() {
    localStorage.clear();
    this.router.navigate(['/' + ConstRoutes.PATH_LOGIN]);
  }

  createCustomer() {
    this.modePopup = 'CREAR';
  }

  updateCustomer(c?: Customer) {
    if (c) {
      this.customerSelected = c;
      this.modePopup = 'ACTUALIZAR';
    }
  }

  deleteCustomer(c?: Customer) {
    if (!c?.id) {
      return;
    }
    if (confirm(`¿Borrar al cliente ${c.name}?`)) {
      this.customerService
        .deleteCustomer(c.id)
        .toPromise()
        .then(() => this.loadCustomers())
        .catch((err: any) => {
          console.error('Error al borrar cliente', err);
          this.error = err?.mensajeDeError || 'Error al borrar el cliente.';
        });
    }
  }

  onClosePopupOk() {
    this.modePopup = 'CLOSED';
    this.loadCustomers();
  }

  onClosePopupCancel() {
    this.modePopup = 'CLOSED';
  }

  // customer-list.component.ts (añadir junto a tus props actuales)
  showActionsModal = false;
  actionCustomer: Customer | null = null;

  // Método para abrir el modal de acciones
  openActionsModal(c: Customer) {
    this.actionCustomer = c;
    this.showActionsModal = true;
  }

  // Método para cerrar el modal
  closeActionsModal() {
    this.showActionsModal = false;
    this.actionCustomer = null;
  }
}
