import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRecipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';
import { RecipeDeleteDialogComponent } from '../delete/recipe-delete-dialog.component';

@Component({
  selector: 'jhi-recipe',
  templateUrl: './recipe.component.html',
})
export class RecipeComponent implements OnInit {
  recipes?: IRecipe[];
  isLoading = false;

  constructor(protected recipeService: RecipeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.recipeService.query().subscribe(
      (res: HttpResponse<IRecipe[]>) => {
        this.isLoading = false;
        this.recipes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRecipe): number {
    return item.id!;
  }

  delete(recipe: IRecipe): void {
    const modalRef = this.modalService.open(RecipeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.recipe = recipe;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
