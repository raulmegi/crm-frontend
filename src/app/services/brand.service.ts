import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Brand} from "../models/brand.model";
import ConstUrls from "../../shared/constants/const-routes";


@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private BRAND_URL = ConstUrls.API_URL + '/brand';

  constructor(private http: HttpClient) {}

  getAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.BRAND_URL}/listarMarcas`);
  }

  getBrandByName(name: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.BRAND_URL}/marca/${name}`);
  }

  createBrand(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(`${this.BRAND_URL}/crearMarca`, brand);
  }

  updateBrand(brand: Brand): Observable<void> {
    return this.http.put<void>(`${this.BRAND_URL}/actualizarMarca`, brand);
  }

  deleteBrand(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.BRAND_URL}/eliminarMarca/${id}`);
  }
}
