import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Quality } from '../../../../../../models/quality.model';

@Component({
  selector: 'app-acc-corrective-dialog',
  templateUrl: './acc-corrective-dialog.component.html',
  styleUrls: ['./acc-corrective-dialog.component.sass']
})
export class AccCorrectiveDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    public dialogRef: MatDialogRef<AccCorrectiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality

  ) { }
  ngOnInit(): void {
  }

}
