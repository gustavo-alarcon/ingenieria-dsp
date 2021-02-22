import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Improvement } from 'src/app/main/models/improvenents.model';

@Component({
  selector: 'app-delete-dialog-improvenments',
  templateUrl: './delete-dialog-improvenments.component.html',
  styleUrls: ['./delete-dialog-improvenments.component.scss']
})
export class DeleteDialogImprovenmentsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Improvement[],
    public dialogRef: MatDialogRef<DeleteDialogImprovenmentsComponent>
  ) {
    console.log(this.data);

  }
  ngOnInit(): void {
  }

}
