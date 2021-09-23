import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { Workshop } from '../../../../../models/evaluations.model';

@Component({
  selector: 'app-requests-create-dialog',
  templateUrl: './requests-create-dialog.component.html',
  styleUrls: ['./requests-create-dialog.component.scss']
})
export class RequestsCreateDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  createEvaluateForm: FormGroup;

  subscriptions: Subscription = new Subscription();

  indexAux: number[] = [];

  workshops:Workshop[] = [
    {
      code: '5', location: 'MSH'
    },
    {
      code: '201306412', location: 'TMM'
    },
    {
      code: '1', location: 'CRC LIMA'
    },
    {
      code: '2', location: 'CRC LA JOYA'
    },
    {
      code: '3', location: 'TMAQ LIMA'
    },
    {
      code: '4', location: 'TH'
    },
    {
      code: '6', location: 'TMAQ LA JOYA'
    }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RequestsCreateDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private evaltService: EvaluationsService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.createEvaluateForm = this.fb.group({
      otChild: ['', Validators.required],
      wof: ['', Validators.required],
      partNumber: ['', Validators.required],
      description: ['', Validators.required],
      workshop: ['', Validators.required],
      observations: [''],
    });
  }

  save(): void {
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
              this.snackbar.open('✅ Evaluación creada correctamente!', 'Aceptar', {
                duration: 6000
              });
              this.dialogRef.close();
            })
            .catch(err => {
              this.loading.next(false);
              this.snackbar.open('🚨 Hubo un error creando la evaluación. Vuelva a intentarlo', 'Aceptar', {
                duration: 6000
              });
            });
        }
      });
    }
  }

}
