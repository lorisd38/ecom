import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProductCartService } from '../service/product-cart.service';

import { ProductCartComponent } from './product-cart.component';

describe('ProductCart Management Component', () => {
  let comp: ProductCartComponent;
  let fixture: ComponentFixture<ProductCartComponent>;
  let service: ProductCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductCartComponent],
    })
      .overrideTemplate(ProductCartComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductCartComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProductCartService);

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
    expect(comp.productCarts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
