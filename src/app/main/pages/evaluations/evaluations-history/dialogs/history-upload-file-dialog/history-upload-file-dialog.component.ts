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
    'user',
    'wof',
    'task',
    'observations',
    'workshop',
    'registryDate',
    'result',
    'kindOfTest',
    'comments',
    'createdAt',
    'createdBy',
    'editedAt',
    'editedBy',
  ];
  
  @ViewChild("settingPaginator", { static: false }) set content(paginator: MatPaginator) {
    this.settingDataSource.paginator = paginator;
  }

  @ViewChild("fileInput2", {read: ElementRef}) fileButton: ElementRef;

  constructor(public dialogRef: MatDialogRef<HistoryUploadFileDialogComponent>,
              private snackbar: MatSnackBar,
              private auth: AuthService,
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
        this.upLoadXlsToTableUpload(this.selected, name.split(".")[0])
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
        const temp = Object.values(el);
        const data =
        {
          otMain: temp[0],
          otChild: temp[1],
          position: temp[3],
          partNumber: temp[4],
          description: temp[5],
          quantity: temp[6],
          status: temp[8],
          user: temp[10],
          wof: temp[11],
          task: temp[12],
          observations: temp[13],
          workshop: temp[14],
          registryDate: temp[19],
          result: temp[25],
          kindOfTest: temp[26],
          comments: temp[27],
          createdAt: temp[28],
          createdBy: temp[29],
          editedAt: temp[30],
          editedBy: temp[31],
        }

        xlsxData.push(data)
      });

      this.currentData = xlsxData;

      this.settingDataSource.data = this.currentData;

      this.fileButton.nativeElement.value = null;
    } else {
      this.snackbar.open("el archivo esta vacio ", "Aceptar", {
        duration: 3000,
      });
    }    
  }
  upLoadXlsToTableUpload(xlsx, name): void {
    const xlsxDataUpload = [];
    //delete Row first
    xlsx.shift();
    xlsx.pop();
    console.log('xlsx ',xlsx)
    if (xlsx.length > 0) {
      xlsx.forEach(el => {
        const temp = Object.values(el);
        const data =
        {
          otMain : temp[0],
          otChild : temp[1],
          position : temp[2],
          partNumber : temp[4],
          description : temp[5],
          quantity : temp[6],
          internalStatus : temp[7],
          status : temp[8],
          user : temp[9],
          wof : temp[11],
          task : temp[12],
          observations : temp[13],
          workshop : temp[14],
          images : temp[15],
          imagesCounter : temp[16],
          inquiries : temp[17],
          inquiriesCounter : temp[18],
          registryDate : temp[19],
          registryTimer : temp[20],
          processDate : temp[21],
          processTimer : temp[22],
          inquiryDate : temp[23],
          inquiryTimer : temp[24],
          result : temp[25],
          kindOfTest : temp[26],
          comments : temp[27],
          createdAt : temp[28],
          createdBy : temp[29],
          editedAt : temp[30],
          editedBy : temp[31],
        }

        xlsxDataUpload.push(data);
        console.log('data : ',data)
      });
      this.currentDataUpload = xlsxDataUpload;

      this.fileButton.nativeElement.value = null;
    } else {
      this.snackbar.open("el archivo esta vacio ", "Aceptar", {
        duration: 3000,
      });
    }
  }
  
  clearDataTable() {
    this.settingDataSource.data = [];
    document.getElementById("fileInput2").nodeValue = "";
  }

  saveDataTable() {
    console.log('this.currentDataUpload : ',this.currentDataUpload)
    this.loading.next(true);

    this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        return this.evaltService.addSettings(this.currentDataUpload, user);
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