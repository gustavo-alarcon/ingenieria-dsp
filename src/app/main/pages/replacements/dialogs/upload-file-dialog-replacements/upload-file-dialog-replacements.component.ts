import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Replacement } from 'src/app/main/models/replacements.models';
import { ReplacementsService } from 'src/app/main/services/replacements.service';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-file-dialog-replacements',
  templateUrl: './upload-file-dialog-replacements.component.html',
  styleUrls: ['./upload-file-dialog-replacements.component.scss']
})
export class UploadFileDialogReplacementsComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  currentData: Array<Replacement> = [];

  replacementsDataSource = new MatTableDataSource<Replacement>();
  replacementsDisplayedColumns: string[] = [
    'createdAt',
    'replacedPart',
    'currentPart',
    'description',
    'kit',
    'support',
    'actions',
  ];

  @ViewChild("replacementsPaginator", { static: false }) set content(paginator: MatPaginator) {
    this.replacementsDataSource.paginator = paginator;
  }

  @ViewChild("fileInput2", { read: ElementRef }) fileButton: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<UploadFileDialogReplacementsComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private repService: ReplacementsService
  ) { }

  ngOnInit(): void {
  }

  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
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

        this.upLoadXlsToTable(selected)
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
          currentPart: el[1] ? el[1].replace('AA:', '').replace('-', '') : null,
          replacedPart: el[0] ? el[0].replace('AA:', '').replace('-', '') : null,
          description: null,
          support: el[3] ? el[3] : false,
          kit: el[4] === 'SI' ? true : false,
          createdAt: el[2] ? new Date(Date.parse(el[2])) : new Date()
        }

        xlsxData.push(data)
      });

      this.currentData = xlsxData;

      this.replacementsDataSource.data = this.currentData;

    } else {
      this.snackbar.open("🚨 Archivo vacío", "Aceptar", {
        duration: 3000,
      });
    }

    this.fileButton.nativeElement.value = null;
  }

  remove(index: number): void {
    this.currentData.splice(index, 1);
    this.replacementsDataSource.data = this.currentData;
  }

  save(): void {
    this.loading.next(true);

    this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        return this.repService.createBulkReplacements(this.currentData, user);
      })
    ).subscribe(batch => {
      if (batch) {
        batch.commit()
          .then(() => {
            this.loading.next(false);
            this.snackbar.open('✅ Archivo subido correctamente!', 'Aceptar', {
              duration: 6000
            });
            this.replacementsDataSource.data = [];
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
