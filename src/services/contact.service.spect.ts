import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContactService } from './contact.service';
import { ConstUrls } from '../const/const-urls';
import { Contact } from '../model/contact.model';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;
  const base = `${ConstUrls.API_BASE}/contacts`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ContactService ]
    });
    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch all contacts', () => {
    const dummy: Contact[] = [
      { id: 1, name: 'A', phone: '123', email: 'a@x', charge: '', customer: null },
      { id: 2, name: 'B', phone: '456', email: 'b@x', charge: '', customer: null }
    ];
    service.getContacts().subscribe(res => {
      expect(res.data).toEqual(dummy);
    });
    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true, data: dummy });
  });

  it('should create a contact', () => {
    const newC: Contact = { id: null, name: 'C', phone: '789', email: 'c@x', charge: '', customer: null };
    service.createContact(newC).subscribe(res => {
      expect(res.data).toEqual({ ...newC, id: 3 });
    });
    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true, data: { ...newC, id: 3 } });
  });

  it('should update a contact', () => {
    const updated: Contact = { id: 4, name: 'D', phone: '000', email: 'd@x', charge: '', customer: null };
    service.updateContact(updated).subscribe(res => {
      expect(res.data).toEqual(updated);
    });
    const req = httpMock.expectOne(`${base}/4`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ok: true, data: updated });
  });

  it('should delete a contact', () => {
    service.deleteContact(5).subscribe(res => {
      expect(res.data).toBeTrue();
    });
    const req = httpMock.expectOne(`${base}/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ ok: true, data: true });
  });
});
