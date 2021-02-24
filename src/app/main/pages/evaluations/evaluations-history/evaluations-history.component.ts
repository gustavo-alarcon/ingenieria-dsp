import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ImprovementEntry } from '../../../models/improvenents.model';
import { MatPaginator } from '@angular/material/paginator';
import { HistoryCreateDialogComponent } from './dialogs/history-create-dialog/history-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Evaluation } from '../../../models/evaluations.model';
import { Observable } from 'rxjs';
import { EvaluationsService } from '../../../services/evaluations.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-evaluations-history',
  templateUrl: './evaluations-history.component.html',
  styleUrls: ['./evaluations-history.component.scss']
})
export class EvaluationsHistoryComponent implements OnInit {

  evaluation$: Observable<Evaluation[]>;

  historyDataSource = new MatTableDataSource<Evaluation>();
  improvementDisplayedColumns: string[] = [
    'otMain',
    'otChild',
    'position',
    'partNumber',
    'description',
    'internalStatus',
    'result',
    'observations',
    'quantity',
    'workshop',
    'status',
    'registryDate',
    'user',
    'wof',
    'task',
    'actions',
  ];

  @ViewChild('improvementPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.historyDataSource.paginator = paginator;
  }

  constructor( public dialog: MatDialog,
               private evaltService: EvaluationsService,
    ) { }

  ngOnInit(): void {
    this.evaluation$ = this.evaltService.getAllEvaluations().pipe(
      tap(res => {
        if (res) {
          this.historyDataSource.data = res;
        }
      })
    );
  }
  openDialog(value: string, entry?: ImprovementEntry, index?: number): void {
    const optionsDialog = {
      width: '40%',
      data: entry
    };
    let dialogRef;

    switch (value) {
      case 'create':
        dialogRef = this.dialog.open(HistoryCreateDialogComponent,
          optionsDialog,
        );

        /* dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'validate':
        dialogRef = this.dialog.open(ValidateDialogImprovenmentsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'edit':
        dialogRef = this.dialog.open(EditDialogImprovenmentsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;

      case 'delete':
        dialogRef = this.dialog.open(DeleteDialogImprovenmentsComponent, {
          width: '350px',
          data: this.improvementDataSource.data[index]
        }
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break; */
    }
  }

  showImprovementEntry(): void {}

}
