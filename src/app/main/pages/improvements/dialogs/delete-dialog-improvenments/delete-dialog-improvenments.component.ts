import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable, of, Subscription } from 'rxjs';
import { map, pluck, startWith, tap } from 'rxjs/operators';
import { ImproventmentModel1 } from 'src/app/main/models/improvenents.model';

@Component({
  selector: 'app-delete-dialog-improvenments',
  templateUrl: './delete-dialog-improvenments.component.html',
  styleUrls: ['./delete-dialog-improvenments.component.scss']
})
export class DeleteDialogImprovenmentsComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ImproventmentModel1[],
    public dialogRef: MatDialogRef<DeleteDialogImprovenmentsComponent>
  ) {
    console.log(this.data);

  }
  ngOnInit(): void {
  }

}
