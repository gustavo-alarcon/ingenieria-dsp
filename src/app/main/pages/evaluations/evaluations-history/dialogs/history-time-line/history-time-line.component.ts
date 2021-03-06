import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Evaluation } from 'src/app/main/models/evaluations.model';

@Component({
  selector: 'app-history-time-line',
  templateUrl: './history-time-line.component.html',
  styleUrls: ['./history-time-line.component.scss']
})
export class HistoryTimeLineComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    public dialogRef: MatDialogRef<HistoryTimeLineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Evaluation
  ) { }

  ngOnInit(): void {
  }

}
