import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quality } from '../../../../../../models/quality.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../../auth/services/auth.service';
import { QualityService } from '../../../../../../services/quality.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../../../../../../models/user-model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-external-dialog',
  templateUrl: './edit-external-dialog.component.html',
  styleUrls: ['./edit-external-dialog.component.scss']
})
export class EditExternalDialogComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  
  externalForm: FormGroup;

  user: User;

  subscription = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    public dialogRef: MatDialogRef<EditExternalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private qualityService: QualityService,
  ) { }

  ngOnInit(): void {
    this.initFormInternal();

    this.subscription.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      })
    )

    this.subscription.add(
      this.authService.user$.subscribe((user) => {
        this.user = user;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  initFormInternal(): void {
    this.externalForm = this.fb.group({
      workdOrden: [this.data.workOrder, Validators.required],
      component: [this.data.component, Validators.required],
      nPackage: [this.data.packageNumber, Validators.required],
      componentHourMeter: [this.data.componentHourMeter, Validators.required],
      nPart: [this.data.partNumber, Validators.required],
      miningOperation: [this.data.miningOperation, Validators.required],
      question1: [this.data.question1, Validators.required],
      question2: [this.data.question2, Validators.required],
      question3: [this.data.question3, Validators.required],
      question4: [this.data.question4, Validators.required],
    });

  }
  save(): void{
    try {
      if (this.externalForm.valid) {
        const resp = this.qualityService.updateQualityExternal(
          this.data.id,
          this.externalForm.value,
          this.user
          );
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {
              batch
                .commit()
                .then(() => {
                  this.snackbar.open('✅ Se actualizo correctamente!', 'Aceptar', {
                    duration: 6000,
                  });
                  this.dialogRef.close(false);
                  this.externalForm.reset();
                })
                .catch((err) => {
                  this.snackbar.open(
                    '🚨 Hubo un error al actualizar  !',
                    'Aceptar',
                    {
                      duration: 6000,
                    }
                  );
                });
            }
          })
        );
      }
    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }

  }

}
