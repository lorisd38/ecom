import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PromotionalCodeDetailComponent } from './promotional-code-detail.component';

describe('PromotionalCode Management Detail Component', () => {
  let comp: PromotionalCodeDetailComponent;
  let fixture: ComponentFixture<PromotionalCodeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionalCodeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ promotionalCode: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PromotionalCodeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PromotionalCodeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load promotionalCode on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.promotionalCode).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
