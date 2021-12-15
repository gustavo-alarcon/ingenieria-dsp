import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SparePart } from 'src/app/main/models/improvenents.model';
import { FrequenciesService } from 'src/app/main/services/frequencies.service';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ot-dialog',
  templateUrl: './ot-dialog.component.html',
  styleUrls: ['./ot-dialog.component.scss'],
})
export class OtDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  otControl = new FormControl(null, Validators.required);
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { list: SparePart[]; threshold: number },
    public dialogRef: MatDialogRef<OtDialogComponent>,
    private snackbar: MatSnackBar,
    private freqService: FrequenciesService
  ) {}

  ngOnInit(): void {}

  save(): void {
    // check validity
    if (this.otControl.invalid) return;

    // update state to loading
    this.loading.next(true);

    this.freqService
      .saveHistory(this.otControl.value, this.data.list, this.data.threshold)
      .pipe(take(1))
      .subscribe((batch) => {
        if (batch) {
          batch
            .commit()
            .then(() => {
              const table_xlsx: any[] = [];

              const headersXlsx = ['PART', '', '_1', 'QTY', 'Parts Category'];

              table_xlsx.push(headersXlsx);

              this.data.list.forEach((part) => {
                if (!part.kit) {
                  const temp = [
                    'AA:' + part.evaluatedPart,
                    '',
                    '',
                    part.quantity,
                    'Additional',
                  ];

                  table_xlsx.push(temp);
                }
              });

              /* generate worksheet */
              const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(table_xlsx);

              /* generate workbook and add the worksheet */
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'SAP');

              /* save to file */
              const name = this.otControl.value + '.xlsx';
              XLSX.writeFile(wb, name);

              this.loading.next(false);
              this.dialogRef.close(true);
            })
            .catch((err) => {
              this.loading.next(false);
              this.snackbar.open(err.message, 'OK', { duration: 3000 });
            });
        }
      });
  }
}
