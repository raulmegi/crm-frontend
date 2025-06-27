import { Component, OnInit } from '@angular/core';
import { Contact } from '../../model/contact.model';
import { ContactService } from '../../../services/contact.service';
import { isOkResponse, loadResponseData, loadResponseError } from '../../../services/utils.service';
import { NgIf, NgForOf } from '@angular/common';
import { ContactPopupComponent } from '../contact-popup/contact-popup.component';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [NgIf, NgForOf, ContactPopupComponent]
})

export class ContactComponent implements OnInit {
  contacts: Contact[] = [];
  error= '';
  selectedContact: Contact | null = null;
  modoPopup: 'NEW' | 'EDIT' | 'CLOSED' = 'CLOSED';

  constructor(
    private contactService: ContactService) {}

    async ngOnInit(): Promise<void> {
        await this.loadContacts();
        }



  async loadContacts(): Promise<void> {
    this.error = '';
    const response = await this.contactService.getContacts();
    if (isOkResponse(response)) {
      this.contacts = loadResponseData(response);
    }
  else {
      this.error = loadResponseError(response);
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
