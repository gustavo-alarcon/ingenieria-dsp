import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  searchForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }
  editDialog(): void{

  }

  deleteDialog(): void{

  }

}
