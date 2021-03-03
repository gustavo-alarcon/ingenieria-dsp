import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Evaluation } from '../../models/evaluations.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-budgets-daily-entries',
  templateUrl: './budgets-daily-entries.component.html',
  styleUrls: ['./budgets-daily-entries.component.scss']
})
export class BudgetsDailyEntriesComponent implements OnInit {
 
  budgetsDailyEntriesDataSource = new MatTableDataSource<Evaluation>();
  budgetsDailyEntriesDisplayedColumns: string[] = [
    'otMain',
    'otChild',
    'position',
    'partNumber',
    'description',
    'quantity',
    'status',
    'createdBy',
    'wof',
    'task',
    'observations',
    'workshop',
    'createdAt',
    'result',
    'kindOfTest',
    'comments',
    'finalizedBy',
    'processAt',
    'finalizedAt',
  ];

  @ViewChild("budgetsDailyEntriesPaginator", { static: false }) set content(paginator: MatPaginator) {
    this.budgetsDailyEntriesDataSource.paginator = paginator;
  }

  @ViewChild("fileInput2", { read: ElementRef }) fileButton: ElementRef;
   
  constructor() { }

  ngOnInit(): void {
  }
  uploadFile(): void{

  }
  editDialog(): void{

  }
  deleteDialog(): void{

  }
  saveDataTable(): void{
    
  }

}
