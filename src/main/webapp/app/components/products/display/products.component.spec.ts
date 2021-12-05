import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProductService } from 'app/entities/product/service/product.service';

import { ProductsComponent } from './products.component';

describe('Product Management Component', () => {
  let comp: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductsComponent],
    })
      .overrideTemplate(ProductsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProductService);

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
    expect(comp.products?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
