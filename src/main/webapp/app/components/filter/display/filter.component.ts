import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ITag, Tag } from '../../../entities/tag/tag.model';
import { TagService } from '../../../entities/tag/service/tag.service';

@Component({
  selector: 'jhi-filter',
  templateUrl: './filter.component.html',
})
export class FilterComponent implements OnInit {
  public listFilter: Tag[];
  public response: NodeListOf<HTMLInputElement> | undefined;
  private listFilterSelected: number[];

  constructor(protected tagService: TagService, protected modalService: NgbModal, public router: Router) {
    this.listFilter = [];
    this.listFilterSelected = [];
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.tagService.query().subscribe((res: HttpResponse<ITag[]>) => {
      this.listFilter = res.body ?? [];
    });
  }

  previousState(): void {
    window.history.back();
  }

  submit(): void {
    this.response = document.querySelectorAll('input');
    this.response.forEach(t => {
      if (t.checked) {
        this.listFilterSelected.push(+t.id);
      }
    });
    this.router.navigate(['/'], { queryParams: { filter: this.listFilterSelected } });
  }
}
