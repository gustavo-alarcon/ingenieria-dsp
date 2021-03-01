import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Evaluation } from '../../../../../models/evaluations.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../../../../../auth/services/auth.service';

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

  currentData: Array<Evaluation> = [];
  currentDataUpload: Array<Evaluation> = [];

  settingDataSource = new MatTableDataSource<Evaluation>();
  settingDisplayedColumns: string[] = [
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

  @ViewChild("settingPaginator", { static: false }) set content(paginator: MatPaginator) {
    this.settingDataSource.paginator = paginator;
  }

  @ViewChild("fileInput2", { read: ElementRef }) fileButton: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<HistoryUploadFileDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private evaltService: EvaluationsService
    ) { }

  ngOnInit(): void {
  }

  onFileSelected(event): void {
    this.loading.next(true);

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
        // this.upLoadXlsToTableUpload(this.selected, name.split(".")[0])
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  upLoadXlsToTable(xlsx, name): void {
    const xlsxData = [];
    //delete Row first 
    xlsx.shift();
    if (xlsx.length > 0) {
      xlsx.forEach(el => {

        let internal_status = 'registered';
        if (el[17]) {
          internal_status = 'processed';
        } else if (el[18]) {
          internal_status = 'finalized';
        }

        let regDate;
        let procDate;
        let finDate;

        if (el[10]) { regDate = this.formatDate(''+el[10])};
        if (el[17]) { procDate = this.formatDate(''+el[17])};
        if (el[18]) { finDate = this.formatDate(''+el[18])};

        const data =
        {
          id: null,
          otMain: el[0] ? el[0] : null,
          otChild: el[1] ? el[1] : null,
          position: el[2] ? el[2] : null,
          partNumber: el[3] ? el[3] : null,
          description: el[4] ? el[4] : null,
          quantity: el[5] ? el[5] : null,
          internalStatus: internal_status,
          status: el[6] ? el[6] : null,
          createdBy: el[7] ? el[7] : null,
          wof: el[8] ? el[8] : null,
          task: el[9] ? el[9] : null,
          createdAt: regDate ? new Date(regDate['Y'],regDate['M'],regDate['D'],regDate['h'],regDate['m'],regDate['s']) : null,
          observations: el[11] ? el[11] : null,
          workshop: el[12],
          result: el[13] ? el[13] : null,
          comments: el[14] ? el[14] : null,
          kindOfTest: el[15] ? el[15] : null,
          finalizedBy: el[16] ? el[16] : null,
          processAt: procDate ? new Date(procDate['Y'],procDate['M'],procDate['D'],procDate['h'],procDate['m'],procDate['s']) : null,
          finalizedAt: finDate ? new Date(finDate['Y'],finDate['M'],finDate['D'],finDate['h'],finDate['m'],finDate['s']) : null,
          images: [],
          imagesCounter: 0,
          inquiries: [],
          inquiriesCounter: 0,
          registryTimer: null,
          processTimer: null,
          inquiryAt: null,
          inquiryTimer: null,
          editedAt: null,
          editedBy: null
        }

        xlsxData.push(data)
      });

      this.currentData = xlsxData;
      
      this.settingDataSource.data = this.currentData;

      this.fileButton.nativeElement.value = null;
      this.loading.next(false);
    } else {
      this.snackbar.open("🚨 Archivo vacío ", "Aceptar", {
        duration: 3000,
      });
    }
  }

  formatDate(excelDate: string): {'D': number, 'M': number, 'Y': number, 'h': number, 'm': number, 's': number} {
    let entry = excelDate.split(" ");
    let date = entry[0];
    let time = entry[1];
    let dateAray = date.split('.');
    let timeArray = time.split(':');
    let day = parseInt(dateAray[0]);
    let month = parseInt(dateAray[1]) - 1;
    let year = parseInt(dateAray[2]);
    let hours = parseInt(timeArray[0]);
    let minutes = parseInt(timeArray[1]);
    let seconds = parseInt(timeArray[2]);
    return {'D': day, 'M': month, 'Y': year, 'h': hours, 'm': minutes, 's': seconds}
  }

  clearDataTable() {
    this.settingDataSource.data = [];
    this.fileButton.nativeElement.value = null;
  }

  saveDataTable() {
    console.log('this.currentDataUpload : ', this.currentData)
    this.loading.next(true);

    this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        return this.evaltService.addSettings(this.currentData, user);
      })
    ).subscribe(batch => {
      if (batch) {
        batch.commit()
          .then(() => {
            this.loading.next(false);
            this.snackbar.open('✅ Archivo subido correctamente!', 'Aceptar', {
              duration: 6000
            });
            this.settingDataSource.data = [];
            this.dialogRef.close();
          })
          .catch(err => {
            this.loading.next(false);
            this.snackbar.open('🚨 Hubo un error subiendo el archivo.', 'Aceptar', {
              duration: 6000
            })
          })
      }
    });

  }

}