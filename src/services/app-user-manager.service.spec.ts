import { TestBed } from '@angular/core/testing';

import { AppUserManagerService } from './app-user-manager.service';

describe('AppUserManagerService', () => {
  let service: AppUserManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUserManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
