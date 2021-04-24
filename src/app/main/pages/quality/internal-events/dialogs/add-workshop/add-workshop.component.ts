import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QualityService } from '../../../../../services/quality.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../../models/user-model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-workshop',
  templateUrl: './add-workshop.component.html',
  styleUrls: ['./add-workshop.component.sass']
})
export class AddWorkshopComponent implements OnInit {

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
        private dialogRef: MatDialogRef<AddWorkshopComponent>,

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
      workshop: ['', Validators.required]
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  save(): void {
    try {
      this.qualityService
        .addWorkshopList(this.form.value, this.user)
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
