import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ImprovementEntry } from '../../models/improvenents.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.scss'],
})
export class EvaluationsComponent implements OnInit {
  

  constructor() {}

  ngOnInit(): void {}
  configTimeDialog(value): void {}
}
