import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Evaluation } from '../../../../../models/evaluations.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-history-upload-file-dialog',
  templateUrl: './history-upload-file-dialog.component.html',
  styleUrls: ['./history-upload-file-dialog.component.scss']
})
export class HistoryUploadFileDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  evaluation$: Observable<Evaluation[]>;
  selected: any;
  
  @ViewChild("fileInput2", {read: ElementRef}) fileButton: ElementRef;

  currentData: Array<Evaluation> = [];

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
  ];

  @ViewChild('improvementPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.historyDataSource.paginator = paginator;
  }

  constructor(public dialogRef: MatDialogRef<HistoryUploadFileDialogComponent>,
              private snackbar: MatSnackBar,
              private  evaltService: EvaluationsService) { }

  ngOnInit(): void {
  }
  save(): void{

  }  
  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      const name = event.target.files[0].name

      var reader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.selected = XLSX.utils.sheet_to_json(ws, { header: 1 });

        this.upLoadXlsToTable(this.selected, name.split(".")[0])
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  upLoadXlsToTable(xlsx, name): void {
    const xlsxData = [];
    if (xlsx.length > 0) {
      xlsx.forEach(el => {
        const temp = Object.values(el);
        const data =
        {
          date: temp[0],
          name: temp[1],
          component: temp[2],
          model: temp[3],
          media: temp[4],
          quantity: temp[5],
          currentPart: temp[6],
          improvedPart: temp[7],
          description: temp[8],
          stock: temp[9],
          availability: temp[10],
        }

        xlsxData.push(data)
      });

      this.currentData = xlsxData;

      this.historyDataSource.data = this.currentData;

      this.fileButton.nativeElement.value = null;
    } else {
      this.snackbar.open("el archivo esta vacio ", "Aceptar", {
        duration: 3000,
      });
    }
  }
}