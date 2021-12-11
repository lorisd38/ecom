import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category, ICategory } from '../../../entities/category/category.model';
import { HttpResponse } from '@angular/common/http';
import { CategoriesService } from '../../services/categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-categories',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {

  constructor(public categoriesService: CategoriesService, protected modalService: NgbModal, public router: Router) {
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.categoriesService.query().subscribe((res: HttpResponse<ICategory[]>) => {
      this.categoriesService.listCategory = res.body ?? [];
    });
  }

  previousState(): void {
    window.history.back();
  }
}
