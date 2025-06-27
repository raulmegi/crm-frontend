import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserManagerPopupComponent } from './app-user-manager-popup.component';

describe('AppUserManagerPopupComponent', () => {
  let component: AppUserManagerPopupComponent;
  let fixture: ComponentFixture<AppUserManagerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppUserManagerPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppUserManagerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
