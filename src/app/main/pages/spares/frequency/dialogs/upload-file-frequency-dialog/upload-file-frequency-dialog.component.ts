import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrequencyEntry } from 'src/app/main/models/frequencies.model';
import { FrequenciesService } from 'src/app/main/services/frequencies.service';

import * as XLSX from 'xlsx';
@Component({
  selector: 'app-upload-file-frequency-dialog',
  templateUrl: './upload-file-frequency-dialog.component.html',
  styleUrls: ['./upload-file-frequency-dialog.component.scss']
})
export class UploadFileFrequencyDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  currentData: Array<FrequencyEntry> = [];

  frequenciesDataSource = new MatTableDataSource<FrequencyEntry>();
  frequenciesDisplayedColumns: string[] = [
    'cuno',
    'wono',
    'wosgno',
    'pano20',
    'component',
    'arrangement',
    'eqmfmd',
    'spqty',
    'actions',
  ];

  @ViewChild("frequenciesPaginator", { static: false }) set content(paginator: MatPaginator) {
    this.frequenciesDataSource.paginator = paginator;
  }

  @ViewChild("fileInput2", { read: ElementRef }) fileButton: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<UploadFileFrequencyDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private freqService: FrequenciesService
  ) {

  }

  ngOnInit(): void {
  }

  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      this.loading.next(true);
      let name = event.target.files[0].name

      var reader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        let selected = XLSX.utils.sheet_to_json(ws, { header: 1 });

        console.log(selected);
        
        // this.upLoadXlsToTable(selected)
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  upLoadXlsToTable(xlsx): void {
    let xlsxData = [];
    xlsx.shift();
    if (xlsx.length > 0) {
      xlsx.forEach(el => {
        let data =
        {
          cuno: el[0] ? el[0] : null,
          wono: el[1] ? el[1] : null,
          wosgno: el[2] ? el[2] : null,
          pano20: el[3] ? el[3] : null,
          component: el[4] ? el[4] : null,
          arrangement: el[5] ? el[5] : null,
          eqmfmd: el[6] ? el[6] : null,
          spqty: el[7] ? el[7] : null,
        }

        xlsxData.push(data)
      });

      this.currentData = xlsxData;

      this.frequenciesDataSource.data = this.currentData;

    } else {
      this.snackbar.open("🚨 Archivo vacío", "Aceptar", {
        duration: 3000,
      });
    }

    this.fileButton.nativeElement.value = null;
  }

  remove(index: number): void {
    this.currentData.splice(index, 1);
    this.frequenciesDataSource.data = this.currentData;
  }

  save(): void {
    this.loading.next(true);

    this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        return this.freqService.calcFrequencies(this.currentData, user);
      })
    ).subscribe(batchList => {
      if (batchList) {
        batchList.forEach(batch => {
          batch.commit()
            .then(() => {
              this.loading.next(false);
              this.snackbar.open('✅ Archivo subido correctamente!', 'Aceptar', {
                duration: 6000
              });
              this.frequenciesDataSource.data = [];
              this.dialogRef.close();
            })
            .catch(err => {
              this.loading.next(false);
              this.snackbar.open('🚨 Hubo un error subiendo el archivo.', 'Aceptar', {
                duration: 6000
              })
            })
        })

      }
    });
  }

}
