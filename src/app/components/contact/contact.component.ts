import { Component, OnInit } from '@angular/core';
import { Contact } from '../../model/contact.model';
import { ContactService } from '../../../services/contact.service';
import { isOkResponse, loadResponseData, loadResponseError } from '../../../services/utils.service';
import { NgIf, NgForOf } from '@angular/common';
import { ContactPopupComponent } from '../contact-popup/contact-popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [NgIf, NgForOf, ContactPopupComponent, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatIconModule,
    MatButtonModule, MatDialogModule]
})

export class ContactComponent implements OnInit {
  contacts: Contact[] = [];
  error = '';
  selectedContact: Contact | null = null;
  modoPopup: 'NEW' | 'EDIT' | 'CLOSED' = 'CLOSED';
  searchControl = new FormControl('');
  filteredContacts: Contact[] = [];

  constructor(private contactService: ContactService, private dialog: MatDialog) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadContacts();

    this.searchControl.valueChanges

      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => this.contactService.findByName(term || ''))
      )

      .subscribe({
        next: response => {
          if (isOkResponse(response)) {
            this.filteredContacts = loadResponseData(response);
            this.error = '';
          } else {
            this.filteredContacts = [];
          }
        },
        error: () => {
          this.filteredContacts = [];
          this.error = 'Error al buscar contactos';
        }
      });
  }

  async loadContacts(): Promise<void> {
    this.error = '';
    const response = await this.contactService.getContacts();
    if (isOkResponse(response)) {
      this.contacts = loadResponseData(response);
      this.filteredContacts = this.contacts;
    } else {
      this.error = loadResponseError(response);
      this.filteredContacts = [];
    }
  }

  newContact() {
    this.selectedContact = null;
    this.modoPopup = 'NEW';
  }

  editContact(contact: Contact) {
    this.selectedContact = contact;
    this.modoPopup = 'EDIT';
  }
  async deleteContact(contact: Contact): Promise<void> {
    const id = contact.id;
    if (typeof id !== 'number') {
      this.error = 'El contacto no tiene ID válido.';
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `¿Seguro que quieres eliminar el contacto <strong>"${contact.name}"</strong>?`
      },
      width: '350px',
    });
    const confirmed = await dialogRef.afterClosed().toPromise();
    if (!confirmed) return;

    const response = await this.contactService.deleteContact(id);
    if (isOkResponse(response)) {
      const isDelete = loadResponseData(response);
      if (isDelete === true) {
        this.searchControl.setValue('');
        alert('Contacto eliminado correctamente');
      }
      await this.loadContacts();
    } else {
      this.error = 'No se pudo eliminar el contacto, puede que existan entidades asociadas.';
    }
  }

  async onPopupSaved() {
    await this.loadContacts();
    this.modoPopup = 'CLOSED';
    this.searchControl.setValue('');
  }

  onPopupCancel() {
    this.modoPopup = 'CLOSED';
  }

}