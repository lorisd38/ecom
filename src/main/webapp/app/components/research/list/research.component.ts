import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'jhi-research',
  templateUrl: './research.component.html'
})
export class ResearchComponent implements OnInit {
  public query: string | null = "";

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log("Le parametre est :",params.q);
      this.query = params.q
    });
  }

}
