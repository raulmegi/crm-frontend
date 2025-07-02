import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../../model/contact.model';
import { ContactService } from '../../../services/contact.service';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../model/customer.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-popup',
  templateUrl: './contact-popup.component.html',
  styleUrls: ['./contact-popup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ContactPopupComponent implements OnInit {
  @Input() contact: Contact | null = null;
  @Input() mode: 'CREAR' | 'EDITAR' = 'CREAR';
  @Output() saved = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  form!: FormGroup;
  error = '';
  customers: Customer[] = [];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private customerService: CustomerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      name: [this.contact?.name || '', Validators.required],
      charge: [this.contact?.charge || ''],
      phone: [this.contact?.phone || '', Validators.required],
      email: [this.contact?.email || '', Validators.email],
      customerId: [this.contact?.customer?.id || null, Validators.required]
    });

    this.customerService.getCustomers().subscribe({
          next: (customers) => {
            this.customers = customers;
          },
          error: () => {
            this.error = 'No se pudieron cargar los clientes.';
          }
        });
      }

  onCancel(): void {
    this.canceled.emit();
  }
  //Evitar mostrar mensaje de error al enviar el formulario si no se ha modificado
  submitted = false;

  async onSubmit(): Promise<void> {
      this.submitted = true;
      this.error = '';
      if (this.form.invalid) {
        this.error = 'Por favor, completa los campos obligatorios.';
        return;
      }

    const fv = this.form.value;
    // datos que se envían al servicio
    const payload: Contact = {
      id: this.contact?.id,
      name: fv.name,
      phone: fv.phone,
      email: fv.email,
      charge: fv.charge,
      customer: { id: fv.customerId, name: '' }
    };

    try {
      if (this.mode === 'CREAR') {
        await this.contactService.createContact(payload);
      } else {
        await this.contactService.updateContact(payload);
      }
      this.saved.emit();
    } catch (err) {
      this.error = 'Error al guardar el contacto.';
    }
  }
}