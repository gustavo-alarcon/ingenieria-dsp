import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-evaluations-settings-dialog',
  templateUrl: './evaluations-settings-dialog.component.html',
  styleUrls: ['./evaluations-settings-dialog.component.scss']
})
export class EvaluationsSettingsDialogComponent implements OnInit {

  timerFormGroup: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<EvaluationsSettingsDialogComponent>,

  ) { }

  ngOnInit(): void {
  }

}
