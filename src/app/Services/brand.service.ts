import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Brand} from "../models/brand.model";
import ConstUrls from "../../shared/constants/const-routes";


@Injectable({
  providedIn: 'root'
})
export class BrandService {
  constructor(private http: HttpClient) {}

  private BRAND_URL = ConstUrls.API_URL + '/brand';

  async obtenerBrands() {
    return await to(
        this.http
            .get<Brand[]>(this.BRAND_URL + '/todos', {
                headers: headers,
                params: loadCredentials(),
                observe: "response"
            })
            .toPromise()
    )
  }

}
