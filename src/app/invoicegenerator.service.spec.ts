import { TestBed } from '@angular/core/testing';

import { InvoicegeneratorService } from './invoicegenerator.service';

describe('InvoicegeneratorService', () => {
  let service: InvoicegeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicegeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
