import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralConfig } from 'src/app/auth/models/generalConfig.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { take, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-evaluations-settings-dialog',
  templateUrl: './evaluations-settings-dialog.component.html',
  styleUrls: ['./evaluations-settings-dialog.component.scss']
})
export class EvaluationsSettingsDialogComponent implements OnInit {

  timerFormGroup: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  generalConfig$: Observable<GeneralConfig>

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GeneralConfig,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EvaluationsSettingsDialogComponent>,
    private snackbar: MatSnackBar,
    private evaltService: EvaluationsService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.generalConfig$ = this.auth.getGeneralConfig()
      .pipe(
        tap(res => {
          this.timerFormGroup = this.fb.group({
            days: [res.processTimer?.days, Validators.required],
            hours: [res.processTimer?.hours, Validators.required],
            minutes: [res.processTimer?.minutes, [Validators.required]]
          });
        })
      )
  }

  save(): void {
    try {
      this.evaltService
        .addTimerInProcess(this.timerFormGroup.value)
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
