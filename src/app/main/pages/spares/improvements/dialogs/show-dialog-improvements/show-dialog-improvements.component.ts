import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ImprovementEntry, ImprovementPart } from 'src/app/main/models/improvenents.model';
import { ImprovementsService } from 'src/app/main/services/improvements.service';

@Component({
  selector: 'app-show-dialog-improvements',
  templateUrl: './show-dialog-improvements.component.html',
  styleUrls: ['./show-dialog-improvements.component.sass']
})
export class ShowDialogImprovementsComponent implements OnInit {
  showForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ImprovementEntry,
    public dialogRef: MatDialogRef<ShowDialogImprovementsComponent>,
    private auth: AuthService,
    private impService: ImprovementsService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.createFormListParts();
  }

  createFormListParts(): void {
    this.showForm = this.fb.group({
      name: [{value: this.data.name ? this.data.name : null, disabled: false}],
      description: [{value: this.data.description ? this.data.description : null, disabled: false}],
      model: [{value: this.data.model ? this.data.model : null, disabled: false}],
      component: [{value: this.data.component ? this.data.component : null, disabled: false}],
      date: [{value: this.data.date ? new Date(this.data.date['seconds'] * 1000) : null, disabled: false}],
      criticalPart: [{value: this.data.criticalPart ? this.data.criticalPart : false, disabled: false}],
      rate: [{ value: this.data.rate ? this.data.rate : false, disabled: false }],
      comments: [{value: this.data.comments ? this.data.comments : null, disabled: false}],
      parts: this.fb.array([])
    });

    this.data.parts.forEach(part => {
      this.addControl(part);
    });
  }

  get parts(): FormArray {
    return this.showForm.get('parts') as FormArray;
  }

  addControl(part?: ImprovementPart): void {
    const group = this.fb.group({
      sparePart: [{value: part.sparePart ? part.sparePart : null, disabled: false}],
      quantity: [{value: part.quantity ? part.quantity : null, disabled: false}],
      currentPart: [{value: part.currentPart ? part.currentPart : null, disabled: false}],
      improvedPart: [{value: part.improvedPart ? part.improvedPart : null, disabled: false}],
      kit: [{value: part.kit ? part.kit : null, disabled: false}],
      stock: [{value: part.stock ? part.stock : 0, disabled: false}],
      availability: [{value: part.availability ? part.availability : null, disabled: false}],
    });

    this.parts.push(group);
  }

}
