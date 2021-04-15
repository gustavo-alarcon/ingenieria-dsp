import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../../../../../models/user-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QualityService } from 'src/app/main/services/quality.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-mining-operation-dialog',
  templateUrl: './add-mining-operation-dialog.component.html',
  styleUrls: ['./add-mining-operation-dialog.component.scss']
})
export class AddMiningOperationDialogComponent implements OnInit {

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
        private dialogRef: MatDialogRef<AddMiningOperationDialogComponent>,

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
      miningOperation: ['', Validators.required]
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  save(): void {
    try {
      this.qualityService
        .addMiningOperationList(this.form.value, this.user)
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
