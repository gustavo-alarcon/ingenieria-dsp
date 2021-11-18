import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quality, WorkshopList } from '../../../../../../models/quality.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { QualityService } from 'src/app/main/services/quality.service';
import { User } from '../../../../../../models/user-model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BasicCause, WorkshopModel } from 'src/app/main/models/workshop.model';
import { map, startWith, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-edit-internal-dialog',
  templateUrl: './edit-internal-dialog.component.html',
  styleUrls: ['./edit-internal-dialog.component.scss'],
})
export class EditInternalDialogComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  internalForm: FormGroup;

  subscription = new Subscription();
  user: User;
  immediateCauses$: Observable<BasicCause[]>;
  basicCausesArray: Array<string>;

  responsibleWorkshopList$: Observable<WorkshopModel[]>;

  isMobile = false;

  optionsWorkshopProcess: string[] = [];
  filteredOptionsWorkshopProcess$: Observable<string[]>;

  reportingWorkshops$: Observable<WorkshopModel[]>;
  components$: Observable<WorkshopList[]>;

  constructor(
    private breakpoint: BreakpointObserver,
    public dialogRef: MatDialogRef<EditInternalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private qualityService: QualityService
  ) {}

  ngOnInit(): void {
    this.initFormInternal();

    this.subscription.add(
      this.breakpoint
        .observe([Breakpoints.HandsetPortrait])
        .subscribe((res) => {
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
          if (!res) {
            return;
          }
          if (this.data.analysis) {
            const actualCause = res.filter(
              (cause) => cause.name === this.data.analysis.causeFailure
            );
            if (actualCause.length) {
              this.internalForm
                .get('analysisCauseFailure')
                .setValue(actualCause[0]);
            }
          }
          return res;
        })
      );

    this.responsibleWorkshopList$ = this.qualityService
      .getAllQualityInternalWorkshop()
      .pipe(
        tap((res) => {
          if (!res) {
            return;
          }
          if (!this.data.workShop) {
            return;
          }

          const actualResponsibleWorkshop = res.filter(
            (workshop) => workshop.workshopName === this.data.workShop
          );

          this.internalForm
            .get('workshop')
            .setValue(actualResponsibleWorkshop[0]);
        })
      );

    this.subscription.add(
      this.internalForm
        .get('analysisCauseFailure')
        .valueChanges.subscribe((res) => {
          if (!res) {
            return;
          }
          this.basicCausesArray = res['basicCauses'];
        })
    );

    // reporting worshop
    this.reportingWorkshops$ = combineLatest(
      this.internalForm.get('workShop').valueChanges.pipe(
        startWith(''),
        map((name) => (name ? name : ''))
      ),
      this.qualityService.getAllQualityInternalWorkshop()
    ).pipe(
      map(([formValue, miningOperation]) => {
        const filter = miningOperation.filter((el) =>
          formValue
            ? el.workshopName.toLowerCase().includes(formValue.toLowerCase())
            : true
        );
        if (!(filter.length === 1) && formValue.length) {
          this.internalForm.get('workShop').setErrors({ invalid: true });
        }

        return filter;
      })
    );

    // components
    this.components$ = combineLatest(
      this.internalForm.get('component').valueChanges.pipe(
        startWith(''),
        map((name) => (name ? name : ''))
      ),
      this.qualityService.getAllComponentsListInternal()
    ).pipe(
      map(([component, list]) => {
        const filteredComponents = list.filter((el) =>
          component
            ? el.name
                .toLowerCase()
                .includes(
                  component.name
                    ? component.name.toLowerCase()
                    : component.toLowerCase()
                )
            : true
        );

        return filteredComponents;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setSelectedWorkshop(event: MatAutocompleteSelectedEvent): void {
    const { workshopProcessName } = event.option.value;
    this.optionsWorkshopProcess = [...workshopProcessName];

    this.filteredOptionsWorkshopProcess$ = this.internalForm
      .get('reportingWorkshopProcess')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterWorkshopProcess(value))
      );
  }

  private _filterWorkshopProcess(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionsWorkshopProcess.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayFn(workshop: WorkshopModel): string {
    return workshop && workshop.workshopName ? workshop.workshopName : '';
  }

  // displayComponent(workshop: WorkshopList): string {
  //   return workshop && workshop.name ? workshop.name : '';
  // }

  initFormInternal(): void {
    this.internalForm = this.fb.group({
      reportingWorkshop: [
        this.data.reportingWorkshop ? this.data.reportingWorkshop : '',
      ],
      reportingWorkshopProcess: [
        this.data.reportingWorkshopProcess
          ? this.data.reportingWorkshopProcess
          : '',
      ],
      component: [this.data.component, Validators.required],
      workdOrden: [this.data.workOrder, Validators.required],
      workShop: [this.data.workShop, Validators.required],
      nPart: [this.data.partNumber, Validators.required],
      eventDetail: [this.data.enventDetail, Validators.required],
      workshop: [this.data.workShop, Validators.required],
      analysisBasicCause: [
        this.data.analysis ? this.data.analysis.basicCause : '',
        Validators.required,
      ],
      analysisCauseFailure: [
        this.data.analysis ? this.data.analysis.causeFailure : '',
        Validators.required,
      ],
      analysisResponsable: [
        this.data.analysis ? this.data.analysis.responsable : '',
        Validators.required,
      ],
      analysisObservations: [
        this.data.analysis ? this.data.analysis.observation : '',
        Validators.required,
      ],
      analysisBahia: [
        this.data.analysis ? this.data.analysis.bahia : '',
        Validators.required,
      ],
    });
  }

  save(): void {
    const causeFailure = this.internalForm.get('analysisCauseFailure').value;
    const analysis = {
      URLimage: this.data.analysis.URLimage,
      bahia: this.internalForm.get('analysisBahia').value,
      basicCause: this.internalForm.get('analysisBasicCause').value,
      causeFailure: causeFailure.name,
      observation: this.internalForm.get('analysisObservations').value,
      process: this.data.analysis.process,
      responsable: this.internalForm.get('analysisResponsable').value,
      responsibleWorkshop: this.internalForm.get('workshop').value,
    };

    try {
      if (this.internalForm.valid) {
        const resp = this.qualityService.updateQualityInternal(
          this.data.id,
          this.internalForm.value,
          analysis,
          this.user
        );
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {
              batch
                .commit()
                .then(() => {
                  this.snackbar.open(
                    '✅ Se actualizo correctamente!',
                    'Aceptar',
                    {
                      duration: 6000,
                    }
                  );
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
