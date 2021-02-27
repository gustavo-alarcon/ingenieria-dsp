import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-evaluations-response-dialog',
  templateUrl: './evaluations-response-dialog.component.html',
  styleUrls: ['./evaluations-response-dialog.component.scss']
})
export class EvaluationsResponseDialogComponent implements OnInit {


  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<EvaluationsResponseDialogComponent>,

  ) { }

  ngOnInit(): void {
  }

}
