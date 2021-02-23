import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-requests-setting-dialog',
  templateUrl: './requests-setting-dialog.component.html',
  styleUrls: ['./requests-setting-dialog.component.scss']
})
export class RequestsSettingDialogComponent implements OnInit {

  timerFormGroup: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<RequestsSettingDialogComponent>,

  ) { }

  ngOnInit(): void {
  }

}
