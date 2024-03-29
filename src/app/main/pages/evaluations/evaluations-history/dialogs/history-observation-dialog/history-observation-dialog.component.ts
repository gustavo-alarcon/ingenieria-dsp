import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Evaluation, EvaluationInquiry } from '../../../../../models/evaluations.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-history-observation-dialog',
  templateUrl: './history-observation-dialog.component.html',
  styleUrls: ['./history-observation-dialog.component.scss']
})
export class HistoryObservationDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  inquiries$: Observable<EvaluationInquiry[]>;
  images$: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<HistoryObservationDialogComponent>,
    private evalService: EvaluationsService
  ) { }

  ngOnInit(): void {
    this.inquiries$ = this.evalService.getEvaluationInquiriesById(this.data.id);
    this.images$ = this.evalService.getEvaluationById(this.data.id)
      .pipe(
        map(res => {
          if (res.images) {
            return Object.values(res.images)
          } else {
            return [];
          }
        })
      )
  }

}
