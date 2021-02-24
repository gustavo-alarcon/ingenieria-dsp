import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { RequestsStartDialogComponent } from '../requests-start-dialog/requests-start-dialog.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-requests-observation-dialog',
  templateUrl: './requests-observation-dialog.component.html',
  styleUrls: ['./requests-observation-dialog.component.sass']
})
export class RequestsObservationDialogComponent implements OnInit {
  timerFormGroup: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
        public dialogRef: MatDialogRef<RequestsStartDialogComponent>,

  ) { }

  ngOnInit(): void {
  }

}
