import { Component, OnInit } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../../auth/services/auth.service';
import { QualityService } from '../../../../../../services/quality.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeneralConfig } from '../../../../../../../auth/models/generalConfig.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  timerFormGroup: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  generalConfig$ : Observable<GeneralConfig>;

  constructor(
        public dialogRef: MatDialogRef<ConfigurationsComponent>,
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private  qualityService: QualityService,
        private auth: AuthService
  ) { }

  ngOnInit(): void {

    this.generalConfig$ = this.auth.getGeneralConfigQuality()
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
      this.qualityService
        .addTimerInRecord(this.timerFormGroup.value)
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
