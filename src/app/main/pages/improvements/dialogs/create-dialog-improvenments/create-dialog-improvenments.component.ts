import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable, of, Subscription } from 'rxjs';
import { map, pluck, startWith, tap } from 'rxjs/operators';
import { ImproventmentModel1 } from 'src/app/main/models/improvenents.model';


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

  options1: string[] = [];
  partsFilteredOptions1: Observable<string[]>;
  arrParts1 = [];

  options2: string[] = [];
  partsFilteredOptions2: Observable<string[]>;
  arrParts2 = [];

  subscriptions: Subscription = new Subscription();

  obs1$: { improved: string, qty: number, index: number };

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ImproventmentModel1[],
    public dialogRef: MatDialogRef<CreateDialogImprovenmentsComponent>
  ) {
    // console.log(this.data);

    for (const post of data) {
      this.options1.push(post.description);
      this.options2.push(post.improved);
    }
  }

  ngOnInit(): void {
    this.createFormListParts();

    this.partsFilteredOptions1 = this.parts.controls[0].get('spareParts').valueChanges.pipe(
      startWith(''),
      map(value1 => this._filter1(value1))
    );
    this.arrParts1.push(this.partsFilteredOptions1);


    this.partsFilteredOptions2 = this.parts.controls[0].get('currentPart').valueChanges.pipe(
      tap(() => {
        this.parts.controls[0].get('amount').setValue('10');
      }),
      startWith(''),
      map(value2 => this._filter2(value2))
    );

    this.arrParts2.push(this.partsFilteredOptions2);

  }

  createFormListParts(): void {
    this.createImprovenmentsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      model: ['', Validators.required],
      component: ['', Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      criticalPart: [false],
      rate: [false],
      parts: this.fb.array([
        this.fb.group({
          spareParts: ['', Validators.required],
          amount: [{ value: '', disabled: true }, Validators.required],
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
    console.log(this.createImprovenmentsForm.value);
    if (this.createImprovenmentsForm.invalid) {
      this.createImprovenmentsForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close('result');
  }

  addControl(): void {
    const group = this.fb.group({
      spareParts: ['', Validators.required],
      amount: [{ value: '', disabled: true }, Validators.required],
      currentPart: ['', Validators.required],
      improvedPart: ['', Validators.required],
      kit: [false],
    });

    this.parts.push(group);

    this.partsFilteredOptions1 = this.parts.controls[this.parts.length - 1].get('spareParts').valueChanges.pipe(
      startWith(''),
      map(value1 => this._filter1(value1))
    );
    this.arrParts1.push(this.partsFilteredOptions1);

    this.partsFilteredOptions2 = this.parts.controls[this.parts.length - 1].get('currentPart').valueChanges.pipe(
      tap(() => {
        this.parts.controls[this.parts.length - 1].get('amount').setValue('10');
      }),
      startWith(''),
      map(value2 => this._filter2(value2))
    );

    this.arrParts2.push(this.partsFilteredOptions2);
  }

  deleteControl(index: number): void {
    this.parts.removeAt(index);
  }

  private _filter1(value1: string): string[] {
    const filterValue1 = value1.toLowerCase();
    return this.options1.filter(option1 => option1.toLowerCase().indexOf(filterValue1) === 0);
  }

  private _filter2(value2: string): string[] {
    const filterValue2 = value2.toLowerCase();
    return this.options2.filter(option2 => option2.toLowerCase().indexOf(filterValue2) === 0);
  }

}
