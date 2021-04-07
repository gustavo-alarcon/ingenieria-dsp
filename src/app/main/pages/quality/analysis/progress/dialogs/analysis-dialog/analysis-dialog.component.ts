import {
  FrequencyList,
  Quality,
  QualityList,
} from './../../../../../../models/quality.model';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import {
  QualityBroadcastList,
  CauseFailureList,
  ProcessList,
} from '../../../../../../models/quality.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { QualityService } from '../../../../../../services/quality.service';
import {
  tap,
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { CauseFailureDialogComponent } from '../cause-failure-dialog/cause-failure-dialog.component';
import { ProcessDialogComponent } from '../process-dialog/process-dialog.component';
import { CostList } from '../../../../../../models/quality.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-analysis-dialog',
  templateUrl: './analysis-dialog.component.html',
  styleUrls: ['./analysis-dialog.component.scss'],
})
export class AnalysisDialogComponent implements OnInit, OnDestroy {
  analysisForm: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  category$: Observable<Quality[]>;
  causeFailure$: Observable<CauseFailureList[]>;
  process$: Observable<ProcessList[]>;
  //category$: Observable<string[]>;

  // step 1
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // step 2
  listAreaForm: FormGroup;

  // chips
  filteredBroadcast = [];
  emailArray: string[] = [];
  broadcastControl = new FormControl();
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredBroadcast$: Observable<QualityBroadcastList[]>;

  nameFileSelect;
  fileSelect;

  state = 'tracing';

  qualityList: QualityList[] = [
    {
      code: 1,
      name:
        'Defecto tolerable que no altera la calidad ni la confiabilidad del produccto',
    },
    {
      code: 2,
      name:
        'Defectos menores que son detectables y facilmente corregibles.(Trabajos de habilidad, ajustes)',
    },
    {
      code: 3,
      name:
        'Defectos que requieren algun metodo de reconstrucción para poder usar.',
    },
    {
      code: 4,
      name:
        'Defectos mayores que incumplen con los criterios de calidad del taller y expectativas del cliente',
    },
    {
      code: 5,
      name:
        'Defectos que inhabilitan el uso de la pieza o de reconstruirla de forma definitiva',
    },
  ];

  costList: CostList[] = [
    { code: 1, name: 'Las pérdidas materiales son menores de $100.       ' },
    { code: 2, name: 'Las pérdidas materiales fluctúan entre $101 y $1000.' },
    { code: 3, name: 'Las pérdidas materiales fluctúan entre $1001 y $7000.' },
    {
      code: 4,
      name: 'Las pérdidas materiales fluctúan entre $7001 y $30,000.',
    },
    { code: 5, name: 'Las pérdidas materiales fluctúan entre $30,001 a más.' },
  ];

  frequencyList: FrequencyList[] = [
    { code: 1, name: 'Ha ocurrido en el ultimo año | Rara vez ' },
    {
      code: 2,
      name: 'Ha ocurrido en el área en el ultimo semestre | Ocasional ',
    },
    {
      code: 3,
      name: 'Ha ocurrido en el área en el ultimos 03 meses | Poco probable',
    },
    { code: 4, name: 'Ha ocurrido en el área en el ultimos mes | Probable ' },
    { code: 5, name: 'Ha ocurrido en el área esta semana | Muy probable ' },
  ];

  resultEvaluation$: Observable<any>;
  areaResponsable$: Observable<any[]>;

  private subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AnalysisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    private qualityService: QualityService,
    private snackbar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.initForm();

    this.emailArray = Object.values(this.data.emailList['0']);

    this.filteredBroadcast$ = this.qualityService.getAllBroadcastList().pipe(
      tap((res: QualityBroadcastList[]) => {
        return res;
      })
    );

    this.causeFailure$ = combineLatest(
      this.analysisForm.get('causeFailure').valueChanges.pipe(
        startWith(''),
        map((name) => (name ? name : ''))
      ),
      this.qualityService.getAllCauseFailureList()
    ).pipe(
      map(([formValue, causeFailuries]) => {
        const filter = causeFailuries.filter((el) =>
          formValue
            ? el.name.toLowerCase().includes(formValue.toLowerCase())
            : true
        );
        if (!(filter.length === 1) && formValue.length) {
          this.analysisForm.get('causeFailure').setErrors({ invalid: true });
        }
        return filter;
      })
    );

    this.process$ = combineLatest(
      this.analysisForm.get('process').valueChanges.pipe(
        startWith(''),
        map((name) => (name ? name : ''))
      ),
      this.qualityService.getAllProcessList()
    ).pipe(
      map(([formValue, process]) => {
        const filter = process.filter((el) =>
          formValue
            ? el.name.toLowerCase().includes(formValue.toLowerCase())
            : true
        );
        if (!(filter.length === 1) && formValue.length) {
          this.analysisForm.get('process').setErrors({ invalid: true });
        }

        return filter;
      })
    );

    this.resultEvaluation$ = combineLatest(
      this.analysisForm.get('quality').valueChanges.pipe(),
      this.analysisForm.get('cost').valueChanges.pipe(),
      this.analysisForm.get('frequency').valueChanges.pipe()
    ).pipe(
      map(([formQuality, formCost, formFrequency]) => {
        const codeQuality = formQuality.code;
        const codeCost = formCost.code;
        const codeFrecuency = formFrequency.code;

        let result: number;
        let roundResult: number;
        result = (codeQuality + codeCost) / (codeFrecuency * 2);
        roundResult = Math.round(result);

        return roundResult;
      })
    );

    this.areaResponsable$ = this.qualityService
      .getAllQualityListResponsibleAreas()
      .pipe(
        tap((resp) => {
          if (resp) {
            return resp;
          }
        })
      );
  }

  initForm(): void {
    this.analysisForm = this.fb.group({
      causeFailure: ['', Validators.required],
      process: ['', Validators.required],
      quality: ['', Validators.required],
      cost: ['', Validators.required],
      frequency: ['', Validators.required],
    });

    this.listAreaForm = this.fb.group({
      areas: this.fb.array([
        this.fb.group({
          corrective: ['', Validators.required],
          name: ['', Validators.required],
        }),
      ]),
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get areas(): FormArray {
    return this.listAreaForm.get('areas') as FormArray;
  }

  addControl(): void {
    const group = this.fb.group({
      corrective: ['', Validators.required],
      name: ['', Validators.required],
    });
    this.areas.push(group);
  }
  deleteControl(index: number): void {
    const emailSelect = this.areas.controls[index].get('name').value;
    const emailDelete = emailSelect.email;

    let l =  this.emailArray.indexOf( emailDelete );
    if ( l !== -1 ) {
      this.emailArray.splice( l, 1 );
    }

    this.areas.removeAt(index);
  }

  onclickArea(event): void{
    const email = event.email;
    if (event.email) {
      this.emailArray.push(email);
    }


  }

  save(): void {
    try {
      if (this.analysisForm.valid && this.listAreaForm.valid) {
        const resp = this.qualityService.saveCorrectiveActions(
          this.data.id,
          this.analysisForm.value,
          this.listAreaForm.value,
          //this.emailArray,
          Object.assign({}, this.emailArray),
          this.state
        );
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {
              batch
                .commit()
                .then(() => {
                  this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
                    duration: 6000,
                  });
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

  onAddCategory(): void {
    this.dialog.open(CauseFailureDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }
  onAddCauseFailure(): void {
    this.dialog.open(CauseFailureDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }
  onAddProcess(): void {
    this.dialog.open(ProcessDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  removeEmail(email: string): void {
    const index = this.emailArray.indexOf(email);

    if (index >= 0) {
      this.emailArray.splice(index, 1);
    }
  }
  addBroadcast(event: MatChipInputEvent): void {

    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.emailArray.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    console.log('this.emailArray : ', this.emailArray)

    this.broadcastControl.setValue(null);
  }
  selectedBroadcast(event: MatAutocompleteSelectedEvent): void {
    event.option.value.emailList.map((el) => {
      this.emailArray.push(el);
    });

    this.broadcastControl.setValue(null);
  }
}
