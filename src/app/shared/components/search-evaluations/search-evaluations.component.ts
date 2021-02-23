import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-evaluations',
  templateUrl: './search-evaluations.component.html',
  styleUrls: ['./search-evaluations.component.scss']
})
export class SearchEvaluationsComponent implements OnInit {

  @Input() title = '';

  constructor() { }

  ngOnInit(): void {
  }

}
