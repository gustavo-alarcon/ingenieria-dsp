import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
  secondFormGroup: FormGroup;

  filesFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PendingSendUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filesFormGroup = new FormGroup({
      checkboxGroup: new FormGroup(
        {
          afa: new FormControl(false),
          afaObs: new FormControl(''),
          summary: new FormControl(false),
          summaryObs: new FormControl(''),
          fesa: new FormControl(false),
          fesaObs: new FormControl(''),
          text: new FormControl(false),
          textObs: new FormControl(''),
          report: new FormControl(false),
          reportObs: new FormControl(''),
        },
        requireCheckboxesToBeCheckedValidator()
      ),
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.filesFormGroup.value;
  }
}

function requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
  return function validate(formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];

      if (control.value === true) {
        checked++;
      }
    });

    if (checked < minRequired) {
      return {
        requireOneCheckboxToBeChecked: true,
      };
    }

    return null;
  };
}
