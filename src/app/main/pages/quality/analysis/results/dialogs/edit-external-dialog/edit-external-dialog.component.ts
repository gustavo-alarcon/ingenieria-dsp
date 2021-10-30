import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quality } from '../../../../../../models/quality.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../../auth/services/auth.service';
import { QualityService } from '../../../../../../services/quality.service';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { User } from '../../../../../../models/user-model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicCause, WorkshopModel } from 'src/app/main/models/workshop.model';
import { map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-external-dialog',
  templateUrl: './edit-external-dialog.component.html',
  styleUrls: ['./edit-external-dialog.component.scss']
})
export class EditExternalDialogComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  
  externalForm: FormGroup;
  immediateCauses$: Observable<BasicCause[]>;
  basicCausesArray: Array<string>;

  
  responsibleWorkshopList$: Observable<WorkshopModel[]>;

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
    );

    this.subscription.add(
      this.authService.user$.subscribe((user) => {
        this.user = user;
      })
    );

    this.immediateCauses$ = this.qualityService
    .getAllQualityImmediateCauses()
      .pipe(
        tap((res) => {

          if (!res) { return; }
          if (this.data.analysis) {
            const actualCause = res.filter(
              (cause) => cause.name === this.data.analysis.causeFailure
            );
            if (actualCause.length) {
              this.externalForm.get('analysisCauseFailure').setValue(actualCause[0]);
            }
          }
          return res;
        })
        );


    this.subscription.add(
      this.externalForm.get('analysisCauseFailure').valueChanges.subscribe((res) => {
        if (!res) { return; }
        this.basicCausesArray = res['basicCauses'];
      })
      );

    this.responsibleWorkshopList$ = this.qualityService
      .getAllQualityInternalWorkshop()
      .pipe(
        tap((res) => {
          if (!res) { return; }
          if (!this.data.workShop) { return; }

          const actualResponsibleWorkshop = res.filter(
            (workshop) => workshop.workshopName === this.data.workShop
          );

          this.externalForm.get('workshop').setValue(actualResponsibleWorkshop[0]);
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
      workshop: [this.data.workShop, Validators.required],
      analysisCauseFailure: [this.data.analysis ? this.data.analysis.causeFailure : '', Validators.required],
      analysisBasicCause: [this.data.analysis ? this.data.analysis.basicCause : '', Validators.required],
      analysisResponsable: [this.data.analysis ? this.data.analysis.responsable : '', Validators.required],
      analysisObservations: [this.data.analysis ? this.data.analysis.observation : '', Validators.required],
      analysisBahia: [this.data.analysis ? this.data.analysis.bahia : '', Validators.required],
      question1: [this.data.question1, Validators.required],
      question2: [this.data.question2, Validators.required],
      question3: [this.data.question3, Validators.required],
      question4: [this.data.question4, Validators.required],
    });

  }

  save(): void{
    const causeFailure = this.externalForm.get('analysisCauseFailure').value;
    const analysis = {
      URLimage: this.data.analysis.URLimage,
      bahia: this.externalForm.get('analysisBahia').value,
      basicCause: this.externalForm.get('analysisBasicCause').value,
      causeFailure: causeFailure.name,
      observation: this.externalForm.get('analysisObservations').value,
      process:  this.data.analysis.process,
      responsable: this.externalForm.get('analysisResponsable').value,
      responsibleWorkshop:  this.externalForm.get('workshop').value
    }

    try {
      if (this.externalForm.valid) {
        const resp = this.qualityService.updateQualityExternal(
          this.data.id,
          this.externalForm.value,
          analysis,
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
