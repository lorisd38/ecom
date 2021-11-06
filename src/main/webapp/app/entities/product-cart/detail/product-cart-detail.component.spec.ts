import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductCartDetailComponent } from './product-cart-detail.component';

describe('ProductCart Management Detail Component', () => {
  let comp: ProductCartDetailComponent;
  let fixture: ComponentFixture<ProductCartDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCartDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ productCart: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProductCartDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProductCartDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load productCart on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.productCart).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
