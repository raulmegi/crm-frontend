import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../app/model/brand.model';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { headers } from './utils.service';


@Injectable({
  providedIn: 'root'
})

export class BrandService {

  constructor(private http: HttpClient) { }
  private BRAND_URL = ConstUrls.API_URL + '/brand';

  async getAllBrands() {
    return await to(
      this.http.get<Brand[]>(`${this.BRAND_URL}/listarMarcas`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async getBrandById(id: number) {
    return await to(
      this.http.get<Brand>(`${this.BRAND_URL}/encontrarMarca/${id}`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async getBrandByName(name: string) {
    return await to(
      this.http.get<Brand>(`${this.BRAND_URL}/marca/${name}`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async createBrand(brand: Brand) {
    return await to(
      this.http.post<Brand>(`${this.BRAND_URL}/crearMarca`, brand, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async updateBrand(brand: Brand) {
    return await to(
      this.http.put<void>(`${this.BRAND_URL}/actualizarMarca/${brand.id}`, brand, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }

  async deleteBrand(id: number) {
    return await to(
      this.http.delete<boolean>(`${this.BRAND_URL}/eliminarMarca/${id}`, {
        headers,
        observe: 'response',
      }).toPromise()
    );
  }
}
