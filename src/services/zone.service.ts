import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Zone } from '../app/model/zone.model';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { headers } from './utils.service';


@Injectable({
  providedIn: 'root'
})

export class ZoneService {

  constructor(private http: HttpClient) {}
  private ZONE_URL = ConstUrls.API_URL + '/zone';

  async getAllZones() {
    return await to(
      this.http.get<Zone[]>(`${this.ZONE_URL}/listarZonas`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async getZoneById(id: number) {
    return await to(
      this.http.get<Zone>(`${this.ZONE_URL}/encontrarZona/${id}`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }
}