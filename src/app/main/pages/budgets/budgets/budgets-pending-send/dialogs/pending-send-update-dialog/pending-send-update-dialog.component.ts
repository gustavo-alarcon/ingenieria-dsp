import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pending-send-update-dialog',
  templateUrl: './pending-send-update-dialog.component.html',
  styleUrls: ['./pending-send-update-dialog.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class PendingSendUpdateDialogComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PendingSendUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }
}
