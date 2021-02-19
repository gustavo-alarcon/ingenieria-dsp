import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-edit-dialog-improvenments',
  templateUrl: './edit-dialog-improvenments.component.html',
  styleUrls: ['./edit-dialog-improvenments.component.scss']
})
export class EditDialogImprovenmentsComponent implements OnInit {

  validationLogisticForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<EditDialogImprovenmentsComponent>
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    this.createFormListParts();
  }

  createFormListParts(): void {
    this.validationLogisticForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      model: ['', Validators.required],
      component: ['', Validators.required],
      date: ['', Validators.required],
      criticalPart: [false],
      rate: [false],
      parts: this.fb.array([
        this.fb.group({
          label: ['', Validators.required],
          amount: ['', Validators.required],
          currentPart: ['', Validators.required],
          improvedPart: ['', Validators.required],
          kit: [false],
        })
      ])
    });
  }

  get parts(): FormArray {
    return this.validationLogisticForm.get('parts') as FormArray;
  }


  save(): void {
    console.log(this.validationLogisticForm.value);
  }
}
