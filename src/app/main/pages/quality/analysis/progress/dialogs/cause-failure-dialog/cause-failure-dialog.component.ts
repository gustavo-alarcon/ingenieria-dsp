import { User } from 'src/app/main/models/user-model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { QualityService } from 'src/app/main/services/quality.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cause-failure-dialog',
  templateUrl: './cause-failure-dialog.component.html',
  styleUrls: ['./cause-failure-dialog.component.scss']
})
export class CauseFailureDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  user: User;
  
  subscription = new Subscription();

  constructor(
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private qualityService: QualityService,
        private authService: AuthService,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<CauseFailureDialogComponent>,

        ) { }

  ngOnInit(): void {
    this.initForm();
    this.subscription.add(
      this.authService.user$.subscribe((user) => {
        this.user = user;
      })
    );
  }

  initForm(){
    this.form = this.fb.group({
      causeFailure: ['', Validators.required]
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  save(): void {
    try {
      this.qualityService
        .addCauseFailureList(this.form.value, this.user)
        .pipe(take(1))
        .subscribe((res) => {
          res.commit().then(() => {
            this.snackbar.open('✅ Se guardado correctamente', 'Aceptar', {
              duration: 6000,
            });
          });
          this.dialogRef.close(true);
        });
    } catch (error) {
      this.snackbar.open('🚨 Hubo un error!', 'Aceptar', {
        duration: 6000,
      });
      this.dialogRef.close(true);
    }
  }
}
