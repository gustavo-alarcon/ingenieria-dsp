import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ImprovementEntry } from '../../../models/improvenents.model';
import { MatPaginator } from '@angular/material/paginator';
import { HistoryCreateDialogComponent } from './dialogs/history-create-dialog/history-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Evaluation } from '../../../models/evaluations.model';
import { combineLatest, Observable } from 'rxjs';
import { EvaluationsService } from '../../../services/evaluations.service';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { HistoryEditDialogComponent } from './dialogs/history-edit-dialog/history-edit-dialog.component';
import { HistoryDeleteDialogComponent } from './dialogs/history-delete-dialog/history-delete-dialog.component';
import { HistoryImageDialogComponent } from './dialogs/history-image-dialog/history-image-dialog.component';
import { HistoryObservationDialogComponent } from './dialogs/history-observation-dialog/history-observation-dialog.component';
import { HistoryUploadFileDialogComponent } from './dialogs/history-upload-file-dialog/history-upload-file-dialog.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';

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
    'createdAt',
    'createdBy',
    'wof',
    'task',
    'actions',
  ];

  @ViewChild('improvementPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.historyDataSource.paginator = paginator;
  }

  statusControl = new FormControl('');
  searchControl = new FormControl('');

  statusList = [
    { status: 'registered', name: 'Registrado' },
    { status: 'processed', name: 'En proceso' },
    { status: 'finalized', name: 'Finalizado' },
    { status: 'consultation', name: 'Consulta' },
  ]

  constructor(
    public dialog: MatDialog,
    private evaltService: EvaluationsService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.evaluation$ = combineLatest(
      this.evaltService.getAllEvaluations(),
      this.statusControl.valueChanges.pipe(startWith('')),
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith('')
      )
    ).pipe(
      map(([evaluations, status, search]) => {
        console.log(status);
        console.log(search);

        let searchTerm = search.toLowerCase();

        let preFilterStatus = [];
        let preFilterSearch = [...evaluations];

        if (status.length > 1) {
          preFilterStatus = evaluations.filter(evaluation => evaluation.internalStatus === status);
          preFilterSearch = preFilterStatus.filter(evaluation => {
            return String(evaluation.otMain).includes(searchTerm) ||
              String(evaluation.otChild).includes(searchTerm)
          })
        } else {
          preFilterSearch = evaluations.filter(evaluation => {
            return String(evaluation.otMain).includes(searchTerm) ||
              String(evaluation.otChild).includes(searchTerm)
          })
        }

        return preFilterSearch;
      })
    ).pipe(
      tap(res => {
        if (res) {
          this.historyDataSource.data = res;
        }
      })
    )

  }

  openDialog(value: string, entry?: ImprovementEntry, index?: number): void {
    const optionsDialog = {
      maxWidth: 500,
      width: '90vw',
      disableClose: true,
      data: entry
    };

    let dialogRef;

    switch (value) {
      case 'edit':
        dialogRef = this.dialog.open(HistoryEditDialogComponent,
          optionsDialog,
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'delete':
        dialogRef = this.dialog.open(HistoryDeleteDialogComponent, {
          data: this.historyDataSource.data[index]
        }
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'image':
        dialogRef = this.dialog.open(HistoryImageDialogComponent,
          optionsDialog
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'observation':
        dialogRef = this.dialog.open(HistoryObservationDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }

  uploadFileDialog(): void {
    this.dialog.open(HistoryUploadFileDialogComponent, {
      width: '100%',
    });
  }

  downloadXlsx(evaluations: Evaluation[]): void {
    let table_xlsx: any[] = [];

    let headersXlsx = [
      'otMain',
      'otChild',
      'position',
      'partNumber',
      'description',
      'internalStatus',
      'result',
      'comments',
      'kindOfTest',
      'observations',
      'quantity',
      'workshop',
      'status',
      'wof',
      'task',
      'finilizedBy',
      'createdAt',
      'finilizedAt',
      'processAt',
      'inquiryAt']

    table_xlsx.push(headersXlsx);

    evaluations.forEach(evaluation => {
      const temp = [
        evaluation.otMain ? evaluation.otMain : "---",
        evaluation.otChild ? evaluation.otChild : "---",
        evaluation.position ? evaluation.position : "---",
        evaluation.partNumber ? evaluation.partNumber : "---",
        evaluation.description ? evaluation.description : "---",
        evaluation.internalStatus ? evaluation.internalStatus : "---",
        evaluation.result ? evaluation.result : "---",
        evaluation.comments ? evaluation.comments : "---",
        evaluation.kindOfTest ? evaluation.kindOfTest : "---",
        evaluation.observations ? evaluation.observations : "---",
        evaluation.quantity ? evaluation.quantity : "---",
        evaluation.workshop ? evaluation.workshop : "---",
        evaluation.status ? evaluation.status : "---",
        evaluation.wof ? evaluation.wof : "---",
        evaluation.task ? evaluation.task : "---",
        evaluation.finalizedBy ? evaluation.finalizedBy : "---",
        evaluation.finalizedAt ? evaluation.finalizedAt : "---",
        evaluation.processAt ? evaluation.processAt : "---",
        evaluation.inquiryAt ? evaluation.inquiryAt : "---",
      ]

      table_xlsx.push(temp);
    })
    

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(table_xlsx);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');

    /* save to file */
    const name = 'Evaluaciones_Resultados' + '.xlsx';
    XLSX.writeFile(wb, name);
  }

}
