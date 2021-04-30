import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Andon } from '../../../../../models/andon.model';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent implements OnInit {

  imageArray: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Andon,
    public dialogRef: MatDialogRef<DetailsDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.imageArray = Object.values(this.data.images);
 }

}
