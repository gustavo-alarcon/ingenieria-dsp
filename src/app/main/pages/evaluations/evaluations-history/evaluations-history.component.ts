import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ImprovementEntry } from '../../../models/improvenents.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-evaluations-history',
  templateUrl: './evaluations-history.component.html',
  styleUrls: ['./evaluations-history.component.scss']
})
export class EvaluationsHistoryComponent implements OnInit {

  // Improvement
  historyDataSource = new MatTableDataSource<ImprovementEntry>();
  improvementDisplayedColumns: string[] = [
    'date',
    'name',
    'component',
    'model',
    'review',
    'user',
    'state',
    'actions',
    'user1',
    'user1',
    'user2',
    'user3',
    'user4',
  ];

  @ViewChild('improvementPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.historyDataSource.paginator = paginator;
  }

  constructor() { }

  ngOnInit(): void {
  }
  openDialog(): void {}
  showImprovementEntry(): void {}

}