import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { to } from 'await-to-js';
import { Contact } from '../../model/contact.model';
import { ContactService } from '../../../services/contact.service';
import { isOkResponse, loadResponseError } from '../../../services/utils.service';


@Component({
  selector: 'app-contact-popup',
  standalone: true,
  templateUrl: './contact-popup.component.html',
  styleUrls: ['./contact-popup.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactPopupComponent implements OnInit {
  @Input() contact: Contact | null = null;
  @Input() mode: 'CREAR' | 'EDITAR' = 'CREAR';
  @Output() saved = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  form!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {}

//   customers: { id: number; name: string }[] = [];

  ngOnInit(): void {


//       this.customerService.getClientes().subscribe(data => {
//         this.customers = data;

    this.form = this.fb.group({
      name: [ this.contact?.name || ''],
      charge: [ this.contact?.charge || ''],
      phone: [ this.contact?.phone || '' ],
      email: [ this.contact?.email || '', Validators.email ],
//       customerId: [ this.contact?.customer.id ]
//       sectorId: [ this.contact?.sector?.id || 1],
//       chainId: [ this.contact?.chain?.id || 1],
//       zoneId: [ this.contact?.zone?.id || 1]
    });
  }

  onCancel(): void {
    this.canceled.emit();
  }

  async onSubmit(): Promise<void> {
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Por favor,   completa los campos obligatorios.';
      return;
    }

    const fv = this.form.value;
    const payload: Contact = {
      id: this.contact?.id,
      name: fv.name,
      phone: fv.phone,
      email: fv.email,
      charge: fv.charge,
//       customer: { id: fv.customerId, name: fv.customerName }
//       sector: { id: fv.sectorId, name: '' },
//       chain: { id: fv.chainId, name: ''},
//       zone: { id: fv.zoneId, name: '' }
    };


    const [err, resp] = await to(
      this.mode === 'CREAR'
        ? this.contactService.createContact(payload)
        : this.contactService.updateContact(payload)
    );

    if (err || !resp || !isOkResponse(resp)) {
      this.error = loadResponseError(resp);
      return;
    }

    this.saved.emit();
  }


}
