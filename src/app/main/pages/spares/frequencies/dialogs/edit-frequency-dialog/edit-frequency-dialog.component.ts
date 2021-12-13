import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { FrequencySparePart } from 'src/app/main/models/frequencySparePart.model';
import { FrequenciesService } from 'src/app/main/services/frequencies.service';

@Component({
  selector: 'app-edit-frequency-dialog',
  templateUrl: './edit-frequency-dialog.component.html',
  styleUrls: ['./edit-frequency-dialog.component.scss'],
})
export class EditFrequencyDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  frequencyFormGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: FrequencySparePart,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditFrequencyDialogComponent>,
    private snackbar: MatSnackBar,
    private freqService: FrequenciesService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.frequencyFormGroup = this.fb.group({
      partNumber: [this.data.partNumber ?? null, Validators.required],
      frequency: [this.data.frequency ?? null, Validators.required],
      avgQty: [this.data.avgQty ?? null, Validators.required],
      minQty: [this.data.minQty ?? null, Validators.required],
      maxQty: [this.data.maxQty ?? null, Validators.required],
    });
  }

  save(): void {
    // check validity
    if (this.frequencyFormGroup.invalid) return;

    // update state to loading
    this.loading.next(true);

    this.freqService
      .editFrequency(this.data.id, this.frequencyFormGroup.value)
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
