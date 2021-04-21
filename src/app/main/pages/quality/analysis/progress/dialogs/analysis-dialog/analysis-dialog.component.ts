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
  map
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

  date = new Date();

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

  resultAnalysis = 0;
  evaluationName = '';


  private subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AnalysisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    private qualityService: QualityService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();

    if (this.data.evaluationAnalisis) {
      this.resultAnalysis = this.data.evaluationAnalisis;
    }
    if (this.data.evaluationAnalisisName) {
      this.evaluationName = this.data.evaluationAnalisisName;
    }

    this.emailArray = this.data.emailList;

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
        const codeQuality = formQuality;
        const codeCost = formCost;
        const codeFrecuency = formFrequency;

        let result: number;
        let roundResult: number;
        result = ((codeQuality + codeCost) / 2) * codeFrecuency;
        roundResult = Math.round(result);
        this.resultAnalysis = roundResult;

        if (0 < roundResult && roundResult < 5) {
          this.evaluationName = 'Menor';
        } else if (4 < roundResult && roundResult < 10) {
          this.evaluationName = 'Moderado';
        } else if (9 < roundResult && roundResult < 20) {
          this.evaluationName = 'Significativo';
        } else if (19 < roundResult && roundResult < 26) {
          this.evaluationName = 'Alto';
        }

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
    if (this.data.analysis) {
      this.analysisForm = this.fb.group({
        causeFailure: this.data.analysis['causeFailure'],
        process: this.data.analysis['process'],
        quality: this.data.analysis['quality'],
        cost: this.data.analysis['cost'],
        frequency: this.data.analysis['frequency'],
      });

      this.listAreaForm = this.fb.group({
        areas: this.fb.array([]),
      });

      this.data.correctiveActions.forEach(accion => {
        this.addControl(accion);
      });
      
      //this.analysisForm.get('quality').setValue(this.data.analysis['quality']['name']);
      //this.analysisForm.controls['quality'].setValue(this.data.analysis['quality']);

      // setValue es para agregarle un valor
      /*  this.analysisForm.controls['quality'].setValue(
        this.data.analysis['quality'],
        { onlySelf: true }
       ); */

      //this.analysisForm.get('quality').setValue(this.data.analysis['quality']);

    } else {
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
            kit: false,
            url: null,
            nameFile: null,
            createdAt: this.date,
            closedAt: null,
            user: null,
          }),
        ]),
      });
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get areas(): FormArray {
    return this.listAreaForm.get('areas') as FormArray;
  }

  addControl(accion?): void {

    let group;

    if (accion) {
      group = this.fb.group({
        corrective: [accion.corrective ? accion.corrective : null, Validators.required],
        name: [accion.name ? accion.name : null, Validators.required],
        kit: false,
        url: null,
        nameFile: null,
        createdAt: this.date,
        closedAt: null,
        user: null,
      });
    }else{
      group = this.fb.group({
        corrective: ['', Validators.required],
        name: ['', Validators.required],
        kit: false,
        url: null,
        nameFile: null,
        createdAt: this.date,
        closedAt: null,
        user: null,
      });

    }

    
    this.areas.push(group);
  }

  deleteControl(index: number): void {
    const emailSelect = this.areas.controls[index].get('name').value;
    const emailDelete = emailSelect.email;

    let l = this.emailArray.indexOf(emailDelete);
    if (l !== -1) {
      this.emailArray.splice(l, 1);
    }

    this.areas.removeAt(index);
  }

  onclickArea(event, index): void {
    const emailSelect = this.areas.controls[index].get('name').value;
    const emailDelete = emailSelect.email;
    const email = event.email;
    if (event.email) {
      this.emailArray.push(email);
    }
  }

  save(): void {

    try {
      if (this.analysisForm.valid ) {
        const resp = this.qualityService.updateQualityEvaluationAnalysis(
          this.data,
          this.resultAnalysis,
          this.evaluationName,
          this.analysisForm.value,
          this.listAreaForm.value
        );
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {
              batch
                .commit()
                .then(() => {
                  this.snackbar.open(
                    '✅ Análisis guardado correctamente!',
                    'Aceptar',
                    {
                      duration: 6000,
                    }
                  );
                  this.dialog.closeAll();
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
      } else {
        this.snackbar.open('Formulario análisis incompleto', 'Aceptar', {
          duration: 6000
        });
      }
    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }

  saveAndSendEmail(): void {
    try {
      if (this.analysisForm.valid && this.areas.length >= 1) {
        const resp = this.qualityService.saveCorrectiveActions(
          this.data,
          this.analysisForm.value,
          this.listAreaForm.value,
          this.emailArray,
          this.resultAnalysis,
          this.evaluationName,
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
                  this.dialogRef.close(false);
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
      } else {
        this.snackbar.open('No realizo análisis ó no agrego acciones correctivas', 'Aceptar', {
          duration: 6000
        });
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

    this.broadcastControl.setValue(null);
  }
  
  selectedBroadcast(event: MatAutocompleteSelectedEvent): void {
    event.option.value.emailList.map((el) => {
      this.emailArray.push(el);
    });

    this.broadcastControl.setValue(null);
  }
}
