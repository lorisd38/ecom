import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PromotionService } from '../service/promotion.service';

import { PromotionComponent } from './promotion.component';

describe('Promotion Management Component', () => {
  let comp: PromotionComponent;
  let fixture: ComponentFixture<PromotionComponent>;
  let service: PromotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PromotionComponent],
    })
      .overrideTemplate(PromotionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PromotionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PromotionService);

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
    expect(comp.promotions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
