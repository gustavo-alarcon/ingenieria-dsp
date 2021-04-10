import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quality } from '../../../../../../models/quality.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { QualityService } from 'src/app/main/services/quality.service';
import { User } from '../../../../../../models/user-model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-edit-internal-dialog',
  templateUrl: './edit-internal-dialog.component.html',
  styleUrls: ['./edit-internal-dialog.component.scss']
})
export class EditInternalDialogComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  
  internalForm: FormGroup;

  subscription = new Subscription();
  user: User;
    
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    public dialogRef: MatDialogRef<EditInternalDialogComponent>,
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
    this.internalForm = this.fb.group({
      component: [this.data.component, Validators.required],
      workdOrden: [this.data.workOrder, Validators.required],
      workShop: [this.data.workShop, Validators.required],
      nPart: [this.data.partNumber, Validators.required],
      eventDetail: [this.data.enventDetail, Validators.required],
    });
  }

  save(): void{
    try {
      if (this.internalForm.valid) {
        const resp = this.qualityService.updateQualityInternal(
          this.data.id,
          this.internalForm.value,
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
                  this.internalForm.reset();
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