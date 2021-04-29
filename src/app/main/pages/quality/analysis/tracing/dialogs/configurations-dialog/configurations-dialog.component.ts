import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QualityService } from '../../../../../../services/quality.service';
import { take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GeneralConfig } from 'src/app/auth/models/generalConfig.model';

@Component({
  selector: 'app-configurations-dialog',
  templateUrl: './configurations-dialog.component.html',
  styleUrls: ['./configurations-dialog.component.scss']
})
export class ConfigurationsDialogComponent implements OnInit {

  timerFormGroup: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  generalConfig$: Observable<GeneralConfig>;

  constructor(
        private dialogRef: MatDialogRef<ConfigurationsDialogComponent>,
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private qualityService: QualityService,
        private auth: AuthService
  ) { }

  ngOnInit(): void {

    this.generalConfig$ = this.auth.getGeneralConfigQuality()
      .pipe(
        tap(res => {
          this.timerFormGroup = this.fb.group({
            days: [res.tracingTimer.days, Validators.required],
            hours: [res.tracingTimer.hours, Validators.required],
            minutes: [res.tracingTimer.minutes, [Validators.required]]
          });
        })
      )

  }

  save(): void {
    try {
      this.qualityService
        .addTimerInTracing(this.timerFormGroup.value)
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
