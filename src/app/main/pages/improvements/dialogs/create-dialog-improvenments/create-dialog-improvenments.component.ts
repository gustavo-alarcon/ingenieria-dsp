import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-create-dialog-improvenments',
  templateUrl: './create-dialog-improvenments.component.html',
  styleUrls: ['./create-dialog-improvenments.component.scss']
})
export class CreateDialogImprovenmentsComponent implements OnInit {

  createImprovenmentsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<CreateDialogImprovenmentsComponent>
  ) {
    // console.log(data);
  }

  ngOnInit(): void {
    this.createFormListParts();
  }

  createFormListParts(): void {
    this.createImprovenmentsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      model: ['', Validators.required],
      component: ['', Validators.required],
      date: ['', Validators.required],
      criticalPart: [false],
      rate: [false],
      parts: this.fb.array([
        this.fb.group({
          spareParts: ['', Validators.required],
          amount: ['', Validators.required],
          currentPart: ['', Validators.required],
          improvedPart: ['', Validators.required],
          kit: [false],
        })
      ])
    });
  }

  get parts(): FormArray {
    return this.createImprovenmentsForm.get('parts') as FormArray;
  }


  save(): void {
    console.log(this.createImprovenmentsForm.valid);
    if (this.createImprovenmentsForm.invalid) {
      this.createImprovenmentsForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close('result');
  }

  addControl(): void {
    console.log(this.parts.controls[0].get('spareParts').value);
    const group = this.fb.group({
      spareParts: ['', Validators.required],
      amount: ['', Validators.required],
      currentPart: ['', Validators.required],
      improvedPart: ['', Validators.required],
      kit: [false],
    });

    this.parts.push(group);
  }

  deleteControl(index: number): void {
    this.parts.removeAt(index);
  }

}
