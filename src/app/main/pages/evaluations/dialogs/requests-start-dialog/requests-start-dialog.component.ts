import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-requests-start-dialog',
  templateUrl: './requests-start-dialog.component.html',
  styleUrls: ['./requests-start-dialog.component.sass']
})
export class RequestsStartDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
        public dialogRef: MatDialogRef<RequestsStartDialogComponent>,

  ) { }

  ngOnInit(): void {
  }

}
