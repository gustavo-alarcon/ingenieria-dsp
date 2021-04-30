import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Evaluation } from 'src/app/main/models/evaluations.model';

@Component({
  selector: 'app-evaluations-time-line-dialog',
  templateUrl: './evaluations-time-line-dialog.component.html',
  styleUrls: ['./evaluations-time-line-dialog.component.scss']
})
export class EvaluationsTimeLineDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    public dialogRef: MatDialogRef<EvaluationsTimeLineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Evaluation
  ) { }

  ngOnInit(): void {
  }

}
