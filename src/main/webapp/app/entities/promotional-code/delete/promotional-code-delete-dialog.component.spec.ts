jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PromotionalCodeService } from '../service/promotional-code.service';

import { PromotionalCodeDeleteDialogComponent } from './promotional-code-delete-dialog.component';

describe('PromotionalCode Management Delete Component', () => {
  let comp: PromotionalCodeDeleteDialogComponent;
  let fixture: ComponentFixture<PromotionalCodeDeleteDialogComponent>;
  let service: PromotionalCodeService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PromotionalCodeDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(PromotionalCodeDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PromotionalCodeDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PromotionalCodeService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({})));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
