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

@NgModule({
  imports: [
    ReactiveFormsModule
  ],
})
export class AppModule { }


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [NgIf, NgForOf, ContactPopupComponent, ReactiveFormsModule]
})

export class ContactComponent implements OnInit {
  contacts: Contact[] = [];
  error= '';
  selectedContact: Contact | null = null;
  modoPopup: 'NEW' | 'EDIT' | 'CLOSED' = 'CLOSED';
  searchControl = new FormControl('');
  filteredContacts: Contact[] = [];

  constructor(
    private contactService: ContactService) {}

    async ngOnInit(): Promise<void> {
      await this.loadContacts();

      // Búsqueda reactiva
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
            } else {
              this.filteredContacts = [];
              this.error = loadResponseError(response);
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
        this.filteredContacts = this.contacts; // Mostrar todos al inicio
      } else {
        this.error = loadResponseError(response);
        this.filteredContacts = [];
      }
    }

 newContact(){
   this.selectedContact = null;
   this.modoPopup='NEW';
   }

  editContact(contact: Contact){
   this.selectedContact = contact;
   this.modoPopup='EDIT';
   }
 async deleteContact(contact: Contact): Promise<void> {
   const id = contact.id;
   if (typeof id !== 'number') {
     this.error = 'El contacto no tiene ID válido.';
     return;
   }

   if (confirm(`¿Seguro que quieres eliminar el contacto "${contact.name}"?`)) {
     const response = await this.contactService.deleteContact(id);
     if (isOkResponse(response)) {
       const isDelete = loadResponseData(response);
       if (isDelete === true) {
         alert('Contacto eliminado correctamente');
       }
       await this.loadContacts();
     } else {
       this.error = loadResponseError(response);
     }
   }
 }

 async onPopupSaved() {
     await this.loadContacts();
     this.modoPopup = 'CLOSED';
   }

   onPopupCancel() {
     this.modoPopup = 'CLOSED';
   }

}
