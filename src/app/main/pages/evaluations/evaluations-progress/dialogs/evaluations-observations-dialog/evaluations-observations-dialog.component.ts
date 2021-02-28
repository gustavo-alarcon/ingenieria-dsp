import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-evaluations-observations-dialog',
  templateUrl: './evaluations-observations-dialog.component.html',
  styleUrls: ['./evaluations-observations-dialog.component.scss']
})
export class EvaluationsObservationsDialogComponent implements OnInit {


  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<EvaluationsObservationsDialogComponent>,

  ) { }

  ngOnInit(): void {
  }

}
