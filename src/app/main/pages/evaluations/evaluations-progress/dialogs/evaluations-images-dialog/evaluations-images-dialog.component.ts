import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-evaluations-images-dialog',
  templateUrl: './evaluations-images-dialog.component.html',
  styleUrls: ['./evaluations-images-dialog.component.scss']
})
export class EvaluationsImagesDialogComponent implements OnInit {


  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<EvaluationsImagesDialogComponent>,

  ) { }

  ngOnInit(): void {
  }

}
