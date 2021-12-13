import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { FrequenciesService } from 'src/app/main/services/frequencies.service';

@Component({
  selector: 'app-create-frequency-dialog',
  templateUrl: './create-frequency-dialog.component.html',
  styleUrls: ['./create-frequency-dialog.component.scss'],
})
export class CreateFrequencyDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  frequencyFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateFrequencyDialogComponent>,
    private snackbar: MatSnackBar,
    private freqService: FrequenciesService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.frequencyFormGroup = this.fb.group({
      partNumber: [null, Validators.required],
      frequency: [null, Validators.required],
      avgQty: [null, Validators.required],
      minQty: [null, Validators.required],
      maxQty: [null, Validators.required],
    });
  }

  save(): void {
    // check validity
    if (this.frequencyFormGroup.invalid) return;

    // update state to loading
    this.loading.next(true);

    this.freqService
      .createFrequency(this.frequencyFormGroup.value)
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
              this.snackbar.open(err.message, 'OK', { duration: 3000 });
            });
        }
      });
  }
}
