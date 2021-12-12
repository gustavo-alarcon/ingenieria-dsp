import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
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
    // 
  }
}
