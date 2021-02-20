import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog-improvenments',
  templateUrl: './delete-dialog-improvenments.component.html',
  styleUrls: ['./delete-dialog-improvenments.component.scss']
})
export class DeleteDialogImprovenmentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
