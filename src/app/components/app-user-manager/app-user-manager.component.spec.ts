import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserManagerComponent } from './app-user-manager.component';

describe('AppUserManagerComponent', () => {
  let component: AppUserManagerComponent;
  let fixture: ComponentFixture<AppUserManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppUserManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppUserManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
