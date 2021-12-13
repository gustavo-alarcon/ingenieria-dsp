import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { FrequencySparePart } from 'src/app/main/models/frequencySparePart.model';
import { FrequenciesService } from 'src/app/main/services/frequencies.service';

@Component({
  selector: 'app-delete-frequency-dialog',
  templateUrl: './delete-frequency-dialog.component.html',
  styleUrls: ['./delete-frequency-dialog.component.scss'],
})
export class DeleteFrequencyDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FrequencySparePart,
    public dialogRef: MatDialogRef<DeleteFrequencyDialogComponent>,
    private snackbar: MatSnackBar,
    private freqService: FrequenciesService
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.loading.next(true);

    this.freqService
      .deleteFrequency(this.data.id)
      .pipe(take(1))
      .subscribe((batch) => {
        if (batch) {
          batch
            .commit()
            .then(() => {
              this.loading.next(false);
              this.dialogRef.close(true);
            })
            .catch((err) => {
              this.loading.next(false);
              this.snackbar.open(err.message, '', { duration: 3000 });
            });
        }
      });
  }
}
