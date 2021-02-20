import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-insert-improvements',
  templateUrl: './dialog-insert-improvements.component.html',
  styleUrls: ['./dialog-insert-improvements.component.scss']
})
export class DialogInsertImprovementsComponent implements OnInit {

  improvenmentsForm: FormGroup;

  constructor(
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.createFormListParts();
  }

  createFormListParts(): void {
    this.improvenmentsForm = this.fb.group({
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
    return this.improvenmentsForm.get('parts') as FormArray;
  }


  save(): void {
    console.log(this.improvenmentsForm.value);
  }

  addControl(): void {
    const group = this.fb.group({
      label: ['', Validators.required],
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
