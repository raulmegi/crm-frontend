import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContactComponent } from './contact.component';
import { ContactService } from '../../../services/contact.service';
import { Contact } from '../../model/contact.model';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockContactService {
  getContacts() { return of({ ok: true, data: [] }); }
  deleteContact(id: number) { return of({ ok: true, data: true }); }
}

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let service: ContactService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ContactComponent ],
      providers: [
        { provide: ContactService, useClass: MockContactService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ContactService);
  });

  it('should load contacts on init', fakeAsync(() => {
    const spy = spyOn(service, 'getContacts').and.returnValue(of({ ok: true, data: [{ id:1, name:'X', phone:'', email:'', charge:'', customer:null }] }));
    fixture.detectChanges();
    tick();
    expect(component.contacts.length).toBe(1);
    const row = fixture.debugElement.query(By.css('tbody tr'));
    expect(row.nativeElement.textContent).toContain('X');
  }));

  it('should show error if load fails', fakeAsync(() => {
    spyOn(service, 'getContacts').and.returnValue(of({ ok: false, error: 'ERR' }));
    fixture.detectChanges();
    tick();
    expect(component.error).toBe('ERR');
    const errEl = fixture.debugElement.query(By.css('.error'));
    expect(errEl.nativeElement.textContent).toBe('ERR');
  }));

  it('should call deleteContact and reload', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    const deleteSpy = spyOn(service, 'deleteContact').and.returnValue(of({ ok: true, data: true }));
    spyOn(component, 'loadContacts');
    component.deleteContact({ id: 2 } as Contact);
    tick();
    expect(deleteSpy).toHaveBeenCalledWith(2);
    expect(component.loadContacts).toHaveBeenCalled();
  }));
});

