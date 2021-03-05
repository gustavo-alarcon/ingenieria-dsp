import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestsStartDialogComponent } from '../requests-start-dialog/requests-start-dialog.component';
import { Evaluation } from 'src/app/main/models/evaluations.model';

@Component({
  selector: 'app-requests-time-line-dialog',
  templateUrl: './requests-time-line-dialog.component.html',
  styleUrls: ['./requests-time-line-dialog.component.scss']
})
export class RequestsTimeLineDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    public dialogRef: MatDialogRef<RequestsStartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Evaluation

  ) { }
  ngOnInit(): void {
  }

}
