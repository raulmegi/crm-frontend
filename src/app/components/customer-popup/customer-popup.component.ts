import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Customer } from '../../model/customer.model';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customer-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-popup.component.html',
  styleUrls: ['./customer-popup.component.css']
})
export class CustomerPopupComponent implements OnInit {
  @Input() customerId!: number;
  @Output() cerrarPopUpOk = new EventEmitter<void>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  customerForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {
    this.customerForm = this.fb.group({
      name: [''],
      cif: [''],
      phone: [''],
      email: [''],
      address: [''],
      sectorId: [0],
      chainId: [0],
      zoneId: [0]
    });
  }

  async ngOnInit() {
    if (this.customerId && this.customerId !== 0) {
      const customer = await this.customerService.getCustomerById(this.customerId).toPromise();
      if (customer) {
        this.customerForm.patchValue({
          name: customer.name,
          cif: customer.cif,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          sectorId: customer.sector?.id ?? 0,
          chainId: customer.chain?.id ?? 0,
          zoneId: customer.zone?.id ?? 0
        });
      }
    }
  }

  getForm(): Customer {
    const formData = this.customerForm.value;
    const customer: any = {
      name: formData.name,
      cif: formData.cif,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      sector: { id: formData.sectorId },
      chain: { id: formData.chainId },
      zone: { id: formData.zoneId }
    };
    if (this.customerId !== 0) {
      customer.id = this.customerId;
    }
    return customer;
  }

async guardar() {
  try {
    const customer = this.getForm(); // si usas formularios reactivos
    const action = this.customerId === 0
      ? this.customerService.createCustomer(customer)
      : this.customerService.updateCustomer(customer);

    await action.toPromise();
    this.cerrarPopUpOk.emit();
  } catch (error) {
    console.error('Error guardando cliente', error);
    this.error = this.customerId === 0
      ? 'Error al crear el cliente.'
      : 'Error al actualizar el cliente.';
  }
}

  cancelar() {
    this.cerrarPopUpCancel.emit();
  }
}