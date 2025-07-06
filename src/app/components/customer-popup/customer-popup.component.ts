import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Sector } from '../../model/sector.model';
import { Chain } from '../../model/chain.model';
import { Zone } from '../../model/zone.model';
import {
  isOkResponse,
  loadResponseData,
  loadResponseError,
  toTuple,
} from '../../../services/utils.service';
import { HttpResponse } from '@angular/common/http';
import { CustomerService } from '../../../services/customer.service';
import { SectorService } from '../../../services/sector.service';
import { ChainService } from '../../../services/chain.service';
import { ZoneService } from '../../../services/zone.service';

@Component({
  selector: 'app-customer-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-popup.component.html',
  styleUrls: ['./customer-popup.component.css'],
})
export class CustomerPopupComponent implements OnInit {
  @Input() customerId!: number;
  @Output() cerrarPopUpOk = new EventEmitter<void>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  customerForm: FormGroup;
  error: string | null = null;

  sectorList: Sector[] = [];
  chainList: Chain[] = [];
  zoneList: Zone[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private sectorService: SectorService,
    private chainService: ChainService,
    private zoneService: ZoneService
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      cif: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      sectorId: [null, Validators.required],
      chainId: [null, Validators.required],
      zoneId: [null, Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      const [err, resp] = await toTuple<HttpResponse<any>>(
        this.sectorService.getAllSectors()
      );
      if (err) {
        console.error('HTTP error cargando sectores', err);
        this.error = 'Error al cargar los sectores.';
      } else if (!isOkResponse(resp!)) {
        console.error(
          'Backend error cargando sectores',
          loadResponseError(resp!)
        );
        this.error = loadResponseError(resp!);
      } else {
        this.sectorList = loadResponseData(resp!) as Sector[];
      }
    } catch (e) {
      console.error('Error inesperado cargando sectores', e);
      this.error = 'Error al cargar los sectores.';
    }

    try {
      const [err, resp] = await toTuple<HttpResponse<any>>(
        this.chainService.getAllChains()
      );
      if (!err && isOkResponse(resp!)) {
        this.chainList = loadResponseData(resp!) as Chain[];
      }
    } catch (e) {
      console.error('Error cargando cadenas', e);
    }

    try {
      const [err, resp] = await toTuple<HttpResponse<any>>(
        this.zoneService.getAllZones()
      );
      if (!err && isOkResponse(resp!)) {
        this.zoneList = loadResponseData(resp!) as Zone[];
      }
    } catch (e) {
      console.error('Error cargando zonas', e);
    }

    if (this.customerId && this.customerId !== 0) {
      try {
        const customer = await this.customerService
          .getCustomerById(this.customerId)
          .toPromise();
        if (customer) {
          this.customerForm.patchValue({
            name: customer.name,
            cif: customer.cif,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
            sectorId: customer.sector?.id ?? null,
            chainId: customer.chain?.id ?? null,
            zoneId: customer.zone?.id ?? null,
          });
        } else {
          this.error = 'No se encontró el cliente.';
        }
      } catch (e) {
        console.error('Error cargando cliente', e);
        this.error = 'Error al cargar los datos del cliente.';
      }
    }
  }

  async guardar() {
    this.error = null;
    this.customerForm.markAllAsTouched();

    if (this.customerForm.invalid) {
      this.error = 'Por favor completa todos los campos obligatorios correctamente.';
      return;
    }
    const f = this.customerForm.value;
    const payload: any = {
      name: f.name,
      cif: f.cif,
      phone: f.phone,
      email: f.email,
      address: f.address,
      sector: { id: f.sectorId },
      chain: { id: f.chainId },
      zone: { id: f.zoneId },
    };
    if (this.customerId && this.customerId !== 0) {
      payload.id = this.customerId;
    }

    try {
      const action =
        this.customerId === 0
          ? this.customerService.createCustomer(payload)
          : this.customerService.updateCustomer(payload);

      await action.toPromise();
      this.cerrarPopUpOk.emit();
    } catch (error: any) {
      console.error('Error guardando cliente', error);
      this.error =
        this.customerId === 0
          ? 'Error al crear el cliente.'
          : 'Error al actualizar el cliente.';
    }
  }

  cancelar() {
    this.cerrarPopUpCancel.emit();
  }
}
