import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrequencySparePart } from 'src/app/main/models/frequencySparePart.model';
import { FrequenciesService } from 'src/app/main/services/frequencies.service';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bulk-dialog',
  templateUrl: './bulk-dialog.component.html',
  styleUrls: ['./bulk-dialog.component.scss'],
})
export class BulkDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  currentData: Array<Partial<FrequencySparePart>> = [];

  frequenciesDataSource = new MatTableDataSource<Partial<FrequencySparePart>>();
  frequenciesDisplayedColumns: string[] = [
    'partNumber',
    'frequency',
    'avgQty',
    'minQty',
    'maxQty',
    'actions',
  ];

  @ViewChild('frequenciesPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.frequenciesDataSource.paginator = paginator;
  }

  @ViewChild('fileInput2', { read: ElementRef }) fileButton: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<BulkDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private freqService: FrequenciesService
  ) {}

  ngOnInit(): void {}

  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      let name = event.target.files[0].name;

      var reader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {
          type: 'binary',
          cellDates: true,
        });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        let selected = XLSX.utils.sheet_to_json(ws, { header: 1 });

        this.upLoadXlsToTable(selected);
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  upLoadXlsToTable(xlsx): void {
    let xlsxData: Array<Partial<FrequencySparePart>> = [];
    xlsx.shift();
    if (xlsx.length > 0) {
      xlsx.forEach((el) => {
        let data: Partial<FrequencySparePart> = {
          partNumber: el[0] ? el[0] : null,
          frequency: el[1] ? el[1] : null,
          avgQty: el[2] ? el[2] : null,
          minQty: el[3] ? el[3] : null,
          maxQty: el[4] ? el[4] : null,
        };

        xlsxData.push(data);
      });

      this.currentData = xlsxData;

      this.frequenciesDataSource.data = this.currentData;
    } else {
      this.snackbar.open('🚨 Archivo vacío', 'Aceptar', {
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

    this.freqService
      .createBulkFrequencies(this.currentData)
      .subscribe((batchList) => {
        if (batchList) {
          const total = batchList.length;

          batchList.forEach((batch, index) => {
            batch
              .commit()
              .then(() => {
                this.loading.next(false);
                this.snackbar.open(
                  `✅ Subido ${index + 1}/${total} correctamente!`,
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
                this.frequenciesDataSource.data = [];
                this.dialogRef.close();
              })
              .catch((err) => {
                this.loading.next(false);
                this.snackbar.open(
                  '🚨 Hubo un error subiendo el archivo.',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              });
          });
        }
      });
  }
}
