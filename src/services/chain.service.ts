import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chain } from '../app/model/chain.model';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { headers } from './utils.service';


@Injectable({
  providedIn: 'root'
})

export class ChainService {

  constructor(private http: HttpClient) { }
  private CHAIN_URL = ConstUrls.API_URL + '/chain';

  async getAllChains() {
    return await to(
      this.http.get<Chain[]>(`${this.CHAIN_URL}/listarCadenas`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async getChainById(id: number) {
    return await to(
      this.http.get<Chain>(`${this.CHAIN_URL}/encontrarCadena/${id}`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }
}