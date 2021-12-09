import {Component, Input, OnInit} from '@angular/core';
import { IProduct } from '../../../entities/product/product.model';
import {PromotionService} from "../../services/promotion.service";

@Component({
  selector: 'jhi-list-product',
  templateUrl: './list-product.component.html',
})
export class ListProductComponent implements OnInit{
  @Input() products: IProduct[] | undefined = [];

  constructor(private promotionService: PromotionService) {
  }

  trackId(index: number, item: IProduct): number {
    return item.id!;
  }

  ngOnInit(): void {
    this.promotionService.query().subscribe((res) => {
      this.promotionService.promotions = res.body;
      console.log("res.body",res.body)
    })
  }
}
