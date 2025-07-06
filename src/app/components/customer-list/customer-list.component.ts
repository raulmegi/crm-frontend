import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, startWith, map } from 'rxjs/operators';

import ConstRoutes from '../../shared/constants/const-routes';
import { Customer } from '../../model/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { CustomerPopupComponent } from '../customer-popup/customer-popup.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';



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
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
  ],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  sectors: any[] = [];
  chains: any[] = [];
  zones: any[] = [];
  selectedSectorId: number | null = null;
  selectedChainId: number | null = null;
  selectedZoneId: number | null = null;
  searchControl = new FormControl('');
  customerSelected?: Customer;
  error = '';
  modePopup: 'CLOSED' | 'CREAR' | 'ACTUALIZAR' = 'CLOSED';

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    await this.loadCustomers();
    this.sectors = this.getUnique('sector');
    this.chains = this.getUnique('chain');
    this.zones = this.getUnique('zone');

    this.filteredCustomers = this.customers;
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        startWith(''),
        map((v) => (v ?? '').toLowerCase().trim())
      )
      .subscribe((term) => {
        this.filterCustomers(term);
      });
  }
  getUnique(field: 'sector' | 'chain' | 'zone') {
    const map = new Map();
    for (const c of this.customers) {
      if (c[field] && c[field].id && !map.has(c[field].id)) {
        map.set(c[field].id, c[field]);
      }
    }
    return Array.from(map.values());
  }

  filterCustomers(searchTerm?: string) {
    const term = (searchTerm ?? this.searchControl.value ?? '').toLowerCase().trim();
    this.filteredCustomers = this.customers.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(term);
      const matchesSector = !this.selectedSectorId || c.sector?.id === this.selectedSectorId;
      const matchesChain = !this.selectedChainId || c.chain?.id === this.selectedChainId;
      const matchesZone = !this.selectedZoneId || c.zone?.id === this.selectedZoneId;
      return matchesSearch && matchesSector && matchesChain && matchesZone;
    });
    this.customerSelected = this.filteredCustomers[0];
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

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `¿Estás seguro de eliminar el cliente <strong>"${c.name}"</strong>?`
      },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.customerService
          .deleteCustomer(c.id)
          .toPromise()
          .then(() => this.loadCustomers())
          .catch((err: any) => {
            console.error('Error al borrar cliente', err);
            this.error = err?.mensajeDeError || 'Error al borrar el cliente.';
          });
      }
    });
  }


  onClosePopupOk() {
    this.modePopup = 'CLOSED';
    this.loadCustomers();
  }

  onClosePopupCancel() {
    this.modePopup = 'CLOSED';
  }

  showActionsModal = false;
  actionCustomer: Customer | null = null;

  openActionsModal(c: Customer) {
    this.actionCustomer = c;
    this.showActionsModal = true;
  }

  closeActionsModal() {
    this.showActionsModal = false;
    this.actionCustomer = null;
  }
}
