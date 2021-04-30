import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GeneralConfig } from 'src/app/auth/models/generalConfig.model';

@Component({
  selector: 'app-requests-setting-dialog',
  templateUrl: './requests-setting-dialog.component.html',
  styleUrls: ['./requests-setting-dialog.component.scss']
})
export class RequestsSettingDialogComponent implements OnInit {

  timerFormGroup: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  generalConfig$ : Observable<GeneralConfig>;

  constructor(
        public dialogRef: MatDialogRef<RequestsSettingDialogComponent>,
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private  evaltService: EvaluationsService,
        private auth: AuthService
  ) { }

  ngOnInit(): void {

    this.generalConfig$ = this.auth.getGeneralConfig()
      .pipe(
        tap(res => {
          this.timerFormGroup = this.fb.group({
            days: [res.registryTimer.days, Validators.required],
            hours: [res.registryTimer.hours, Validators.required],
            minutes: [res.registryTimer.minutes, [Validators.required]]
          });
        })
      )

  }

  save(): void {
    try {
      this.evaltService
        .addTimerInRequest(this.timerFormGroup.value)
        .pipe(take(1))
        .subscribe((res) => {
          res.commit().then(() => {
            this.dialogRef.close('result');
            this.snackbar.open('✅ Timer guardado', 'Aceptar', {
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
