import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sector } from '../app/model/sector.model';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { headers } from './utils.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class SectorService {

  constructor(private http: HttpClient) {}
  private SECTOR_URL = ConstUrls.API_URL + '/sector';

  async getAllSectors() {
    return await to(
      this.http.get<Sector[]>(`${this.SECTOR_URL}/listarSectores`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async getSectorById(id: number) {
    return await to(
      this.http.get<Sector>(`${this.SECTOR_URL}/encontrarSector/${id}`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }
}