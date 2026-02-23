import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdminServiceService } from './admin-service.service';

describe('AdminServiceService', () => {
  let service: AdminServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AdminServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
