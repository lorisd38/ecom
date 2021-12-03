import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category, ICategory } from '../../../entities/category/category.model';
import { HttpResponse } from '@angular/common/http';
import { CategoriesService } from '../service/categories.service';

@Component({
  selector: 'jhi-payment',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  listCategory: Category[];

  constructor(protected categoriesService: CategoriesService, protected modalService: NgbModal) {
    this.listCategory = [];
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.categoriesService.query().subscribe((res: HttpResponse<ICategory[]>) => {
      this.listCategory = res.body ?? [];
    });
  }

  previousState(): void {
    window.history.back();
  }
}
