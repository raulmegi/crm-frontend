import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../app/model/contact.model';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { headers } from './utils.service';


@Injectable({
  providedIn: 'root',
})
export class ContactService {

  constructor(private http: HttpClient) {}
  private CONTACT_URL = ConstUrls.API_URL + '/contact';

  async getContacts() {
        return await to(
            this.http
                .get<any[]>(this.CONTACT_URL + '/get', {
                    headers: headers,
                    observe: "response"
                })
                .toPromise()
        )
    }

async createContact(contact: Contact) {
        return await to(
            this.http
                .post<any>(this.CONTACT_URL + '/create', contact, {
                    headers: headers,
                    observe: "response",
                })
                .toPromise()
        )
    }

 async deleteContact(id: number) {
        return await to(
            this.http
                .delete<boolean>(this.CONTACT_URL + '/delete/' + id, {
                    headers: headers,
                    observe: "response"
                })
                .toPromise()
        )
    }

    async updateContact(contact: Contact) {
        return await to(
            this.http
                .put<any>(this.CONTACT_URL + '/edit', contact, {
                    headers: headers,
                    observe: "response",
                })
                .toPromise()
        )
    }
  async findByName(name: string) {
      return await to(
          this.http
              .get<Contact[]>(`${this.CONTACT_URL}/findByName?name=${encodeURIComponent(name)}`, {
                  headers: headers,
                  observe: "response"
              })
              .toPromise()
      );
  }

}
