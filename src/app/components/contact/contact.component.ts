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

// importa el módulo `ReactiveFormsModule`.
// Esto permite usar formularios reactivos en el componente,
// habilitando el uso de `FormControl`,
// validaciones y manejo reactivo de formularios en Angular.


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
  // Control para la búsqueda reactiva por nombre
  searchControl = new FormControl('');
  filteredContacts: Contact[] = [];

  constructor(private contactService: ContactService) {}

    async ngOnInit(): Promise<void> {
      await this.loadContacts();

      // Búsqueda reactiva por nombre
      // Se suscribe a los cambios del control de búsqueda
        this.searchControl.valueChanges

        .pipe(
          // Espera 300 ms después de que el usuario deja de escribir para evitar demasiadas solicitudes al servidor
          debounceTime(300),
          // Ignora valores repetidos para evitar llamadas innecesarias
          distinctUntilChanged(),
          // Mapea el valor del control de búsqueda a una llamada al servicio de contactos
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
   //Comprobar si el ID es un número válido
   if (typeof id !== 'number') {
     this.error = 'El contacto no tiene ID válido.';
     return;
   }

   if (confirm(`¿Seguro que quieres eliminar el contacto "${contact.name}"?`)) {
     const response = await this.contactService.deleteContact(id);
     if (isOkResponse(response)) {
       const isDelete = loadResponseData(response);
       if (isDelete === true) {
         this.searchControl.setValue('');
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
     this.searchControl.setValue('');
   }

   onPopupCancel() {
     this.modoPopup = 'CLOSED';
   }

}
