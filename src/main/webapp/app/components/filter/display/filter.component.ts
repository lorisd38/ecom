import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FilterService } from 'app/components/services/filter.service';

@Component({
  selector: 'jhi-categories',
  templateUrl: './categories.component.html',
})
export class FilterComponent implements OnInit {
  constructor(protected categoriesService: FilterService, protected modalService: NgbModal, public router: Router) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {}

  previousState(): void {
    window.history.back();
  }
}
