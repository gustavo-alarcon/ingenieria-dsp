import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Evaluation } from 'src/app/main/models/evaluations.model';
import { Quality } from '../../../../../../models/quality.model';

@Component({
  selector: 'app-time-line-dialog',
  templateUrl: './time-line-dialog.component.html',
  styleUrls: ['./time-line-dialog.component.scss']
})
export class TimeLineDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    public dialogRef: MatDialogRef<TimeLineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality

  ) { }
  ngOnInit(): void {
  }

}
