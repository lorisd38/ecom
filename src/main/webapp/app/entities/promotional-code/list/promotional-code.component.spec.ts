import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PromotionalCodeService } from '../service/promotional-code.service';

import { PromotionalCodeComponent } from './promotional-code.component';

describe('PromotionalCode Management Component', () => {
  let comp: PromotionalCodeComponent;
  let fixture: ComponentFixture<PromotionalCodeComponent>;
  let service: PromotionalCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PromotionalCodeComponent],
    })
      .overrideTemplate(PromotionalCodeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PromotionalCodeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PromotionalCodeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.promotionalCodes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
