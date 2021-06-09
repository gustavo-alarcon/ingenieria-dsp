import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
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

  additionalsDropDownOptions = [
    { value: 'parallel', viewValue: 'Paralelo' },
    { value: 'budget', viewValue: 'Presupuesto' },
  ];

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
          summary: new FormControl(false),
          fesa: new FormControl(false),
          text: new FormControl(false),
          report: new FormControl(false),
          afaObs: new FormControl(''),
          summaryObs: new FormControl(''),
          fesaObs: new FormControl(''),
          textObs: new FormControl(''),
          reportObs: new FormControl(''),
        },
        requireCheckboxesToBeCheckedValidator()
      ),
      additionals: this._formBuilder.array([]),
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.filesFormGroup.value;
  }

  get additionalForms(): FormArray {
    return this.filesFormGroup.get('additionals') as FormArray;
  }

  addAdditional(): void {
    const form = this._formBuilder.group({
      type: ['parallel', Validators.required],
      typeObs: [''],
    });

    this.additionalForms.push(form);
  }

  deleteAdditional(i: number) {
    this.additionalForms.removeAt(i);
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
