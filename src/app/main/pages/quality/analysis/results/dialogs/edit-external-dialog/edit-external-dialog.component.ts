import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MiningOperation,
  Quality,
  WorkshopList,
} from '../../../../../../models/quality.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../../auth/services/auth.service';
import { QualityService } from '../../../../../../services/quality.service';
import { BehaviorSubject, Subscription, Observable, combineLatest } from 'rxjs';
import { User } from '../../../../../../models/user-model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicCause, WorkshopModel } from 'src/app/main/models/workshop.model';
import { map, startWith, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-edit-external-dialog',
  templateUrl: './edit-external-dialog.component.html',
  styleUrls: ['./edit-external-dialog.component.scss'],
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

  optionsWorkshopProcess: string[] = [];
  filteredOptionsWorkshopProcess$: Observable<string[]>;

  reportingWorkshops$: Observable<WorkshopModel[]>;
  components$: Observable<WorkshopList[]>;
  miningOperation$: Observable<MiningOperation[]>;

  responsibleWorkshopProcesses: string[] = [];

  constructor(
    private breakpoint: BreakpointObserver,
    public dialogRef: MatDialogRef<EditExternalDialogComponent>,
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
              this.externalForm
                .get('analysisCauseFailure')
                .setValue(actualCause[0]);
            }
          }
          return res;
        })
      );

    this.subscription.add(
      this.externalForm
        .get('analysisCauseFailure')
        .valueChanges.subscribe((res) => {
          if (!res) {
            return;
          }
          this.basicCausesArray = res['basicCauses'];
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

          this.responsibleWorkshopProcesses =
            actualResponsibleWorkshop[0].workshopProcessName;

          this.externalForm
            .get('workshop')
            .setValue(actualResponsibleWorkshop[0]);
        })
      );

    // components
    this.components$ = combineLatest(
      this.externalForm.get('component').valueChanges.pipe(
        startWith(''),
        map((name) => (name ? name : ''))
      ),
      this.qualityService.getAllComponentsListExternal()
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

    // mining operation
    this.miningOperation$ = combineLatest(
      this.externalForm.get('miningOperation').valueChanges.pipe(
        startWith(''),
        map((name) => (name ? name : ''))
      ),
      this.qualityService.getAllMiningOperationList()
    ).pipe(
      map(([formValue, miningOperation]) => {
        const filter = miningOperation.filter((el) =>
          formValue
            ? el.name.toLowerCase().includes(formValue.toLowerCase())
            : true
        );
        if (!(filter.length === 1) && formValue.length) {
          this.externalForm.get('miningOperation').setErrors({ invalid: true });
        }

        return filter;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setSelectedWorkshop(event: MatAutocompleteSelectedEvent): void {
    const { workshopProcessName } = event.option.value;
    this.optionsWorkshopProcess = [...workshopProcessName];

    this.filteredOptionsWorkshopProcess$ = this.externalForm
      .get('process')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterWorkshopProcess(value))
      );
  }

  setResponsibleProcesses(event: MatSelectChange): void {
    const { workshopProcessName } = event.value;
    this.responsibleWorkshopProcesses = [...workshopProcessName];
  }

  compareWorkshop(o1: WorkshopModel, o2: WorkshopModel) {
    return o1?.workshopName == o2?.workshopName;
  }

  compareProcess(o1: string, o2: string) {
    return o1 == o2;
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

  initFormInternal(): void {
    this.externalForm = this.fb.group({
      workdOrden: [this.data.workOrder, Validators.required],
      component: [this.data.component, Validators.required],
      nPackage: [this.data.packageNumber, Validators.required],
      componentHourMeter: [this.data.componentHourMeter, Validators.required],
      nPart: [this.data.partNumber, Validators.required],
      miningOperation: [this.data.miningOperation, Validators.required],
      workshop: [this.data.workShop, Validators.required],
      process: [this.data.analysis ? this.data.analysis.process : ''],
      analysisCauseFailure: [
        this.data.analysis
          ? this.data.analysis.causeFailure
            ? this.data.analysis.causeFailure
            : ''
          : '',
      ],
      analysisBasicCause: [
        this.data.analysis
          ? this.data.analysis.basicCause
            ? this.data.analysis.basicCause
            : ''
          : '',
      ],
      analysisResponsable: [
        this.data.analysis
          ? this.data.analysis.responsable
            ? this.data.analysis.responsable
            : ''
          : '',
      ],
      analysisObservations: [
        this.data.analysis
          ? this.data.analysis.observation
            ? this.data.analysis.observation
            : ''
          : '',
      ],
      analysisBahia: [this.data.analysis ? this.data.analysis.bahia : ''],
      question1: [this.data.question1],
      question2: [this.data.question2],
      question3: [this.data.question3],
      question4: [this.data.question4],
    });
  }

  save(): void {
    const causeFailure = this.externalForm.get('analysisCauseFailure').value;
    const analysis = {
      bahia: this.externalForm.get('analysisBahia').value,
      basicCause: this.externalForm.get('analysisBasicCause').value,
      causeFailure: causeFailure ? causeFailure.name : '',
      observation: this.externalForm.get('analysisObservations').value,
      process: this.externalForm.get('process').value,
      responsable: this.externalForm.get('analysisResponsable').value,
      responsibleWorkshop: this.externalForm.get('workshop').value,
    };

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
                  this.snackbar.open(
                    '✅ Se actualizo correctamente!',
                    'Aceptar',
                    {
                      duration: 6000,
                    }
                  );
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
