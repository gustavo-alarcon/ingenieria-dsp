import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationsService } from '../../../../../services/evaluations.service';

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
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private  evaltService: EvaluationsService,
  ) { }

  ngOnInit(): void {
    console.log('data : ',this.data)
    this.timerFormGroup = this.fb.group({
      hours: [null, Validators.required],
      minutes: [null, [Validators.required]]
    });
  }
  save(): void {
    try {
      const state = 'registered';
      const newTime = this.timerFormGroup.get('hours').value * 3600 * 1000 + this.timerFormGroup.get('minutes').value * 60 * 1000;
      this.evaltService
        .addTimerInRequest(state, newTime)
        .pipe(take(1))
        .subscribe((res) => {
          res.commit().then(() => {
            this.dialogRef.close('result');
            this.snackbar.open('✅ inicio timer', 'Aceptar', {
              duration: 6000,
            });
          });
        });
    } catch (error) {
      this.snackbar.open('🚨 Error al actualizar', 'Aceptar', {
        duration: 6000,
      });
    }

  }

}
