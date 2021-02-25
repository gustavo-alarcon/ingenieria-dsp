import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { take, switchMap } from 'rxjs/operators';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';

@Component({
  selector: 'app-history-create-dialog',
  templateUrl: './history-create-dialog.component.html',
  styleUrls: ['./history-create-dialog.component.scss']
})
export class HistoryCreateDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  createEvaluateForm: FormGroup;

  subscriptions: Subscription = new Subscription();

  indexAux: number[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HistoryCreateDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private  evaltService: EvaluationsService,
  ) {
  }

  ngOnInit(): void {
    this.createForm();
  }
  createForm(): void{
    this.createEvaluateForm = this.fb.group({
      otMain: ['', Validators.required],
      otChild: ['', Validators.required],
      position: ['', Validators.required],
      partNumber: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      status: ['', Validators.required],
      wof: ['', Validators.required],
      task: ['', Validators.required],
    });
  }
  save(): void{
    this.loading.next(true);
    if (this.createEvaluateForm.invalid) {
      this.createEvaluateForm.markAllAsTouched();
      this.loading.next(false);
      return;
    } else {
      this.auth.user$.pipe(
        take(1),
        switchMap(user => {
          return this.evaltService.saveRequest(this.createEvaluateForm.value, user);
        })
    ).subscribe(batch => {
      if (batch) {
        batch.commit()
          .then(() => {
            this.loading.next(false);
            this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
              duration: 6000
            });
          })
          .catch(err => {
            this.loading.next(false);
            this.snackbar.open('🚨 Hubo un error.', 'Aceptar', {
              duration: 6000
            });
          });
      }
    });
  }
}

}
