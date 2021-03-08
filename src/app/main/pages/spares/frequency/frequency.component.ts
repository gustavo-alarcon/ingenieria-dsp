import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FrequencyCalc } from 'src/app/main/models/frequencies.model';
import { FrequenciesService } from 'src/app/main/services/frequencies.service';
import { DeleteFrequencyDialogComponent } from './dialogs/delete-frequency-dialog/delete-frequency-dialog.component';
import { EditFrequencyDialogComponent } from './dialogs/edit-frequency-dialog/edit-frequency-dialog.component';
import { UploadFileFrequencyDialogComponent } from './dialogs/upload-file-frequency-dialog/upload-file-frequency-dialog.component';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.scss']
})
export class FrequencyComponent implements OnInit {
  frequencies$: Observable<FrequencyCalc[]>;

  // frequency
  frequenciesDataSource = new MatTableDataSource<FrequencyCalc>();
  frequenciesDisplayedColumns: string[] = ['createdAt', 'pano20', 'component', 'frequency', 'min', 'max', 'actions'];

  @ViewChild('frequenciesPaginator', { static: false }) set content(paginator: MatPaginator) {
    this.frequenciesDataSource.paginator = paginator;
  }

  constructor(
    private freqServices: FrequenciesService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.frequencies$ = this.freqServices.getAllFrequenciesCalculated().pipe(
      tap(res => {
        if (res) {
          this.frequenciesDataSource.data = res;
        }
      })
    );
  }

  openDialog(value: string, entry?: FrequencyCalc, index?: number): void {
    const optionsDialog = {
      width: '100%',
      data: entry
    };
    let dialogRef;

    switch (value) {
      case 'upload':
        dialogRef = this.dialog.open(UploadFileFrequencyDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;

      case 'edit':
        dialogRef = this.dialog.open(EditFrequencyDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;

      case 'delete':
        dialogRef = this.dialog.open(DeleteFrequencyDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }

}
