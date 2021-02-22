import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-validation-logistics',
  templateUrl: './dialog-validation-logistics.component.html',
  styleUrls: ['./dialog-validation-logistics.component.scss']
})
export class DialogValidationLogisticsComponent implements OnInit {

  validationLogisticForm: FormGroup;

  constructor(
    private fb: FormBuilder,

  ) { }

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
