import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Evaluation, EvaluationInquiry } from 'src/app/main/models/evaluations.model';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-evaluations-observations-dialog',
  templateUrl: './evaluations-observations-dialog.component.html',
  styleUrls: ['./evaluations-observations-dialog.component.scss']
})
export class EvaluationsObservationsDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  inquiries$: Observable<EvaluationInquiry[]>;
  images$: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<EvaluationsObservationsDialogComponent>,
    private evalService: EvaluationsService
  ) { }

  ngOnInit(): void {
    this.inquiries$ = this.evalService.getEvaluationInquiriesById(this.data.id);
    this.images$ = this.evalService.getEvaluationById(this.data.id)
    .pipe(
      map(res => {
        return Object.values(res.images)
      })
    )
  }

}
