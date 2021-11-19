import { User } from './../../../../../../models/user-model';
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { QualityService } from 'src/app/main/services/quality.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  Quality,
  QualityBroadcastList,
} from 'src/app/main/models/quality.model';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatChipInputEvent } from '@angular/material/chips';
import { OnDestroy } from '@angular/core';
import { AuthService } from '../../../../../../../auth/services/auth.service';
import { EvaluationsUser } from 'src/app/main/models/evaluations.model';
import { map } from 'rxjs/operators';
import { CostList, FrequencyList, QualityList } from '../../../../../../models/quality.model';

@Component({
  selector: 'app-assign-specialist-dialog',
  templateUrl: './assign-specialist-dialog.component.html',
  styleUrls: ['./assign-specialist-dialog.component.scss'],
})
export class AssignSpecialistDialogComponent implements OnInit, OnDestroy {
  specialistForm: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  //Chip email
  emailArray: string[] = [];
  filteredBroadcast$: Observable<QualityBroadcastList[]>;
  broadcastControl = new FormControl();
  listBroadcast: string[] = [];

  state = 'process';

  // chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  // Autocomplete
  selectedSpecialist = new BehaviorSubject<any>(null);
  selectedSpecialist$ = this.selectedSpecialist.asObservable();
  actualSpecialist: any = null;

  specialist$: Observable<any[]>;
  nameSpecialist = 'Soporte técnico';

  user: User;
  emailUser;
  counter = 0;

  private subscription = new Subscription();

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
  resultAnalysis = 0;
  evaluationName = '';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    private qualityService: QualityService,
    private snackbar: MatSnackBar,
    public auth: AuthService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.subscription.add(
      this.auth.user$.subscribe((user) => {
        this.user = user;
        const email = this.user.email;

        this.counter++;
        if (this.counter === 1) {
          this.emailArray.push(email);
        }
      })
    );

    this.specialist$ = combineLatest(
      this.specialistForm.get('specialist').valueChanges.pipe(
        startWith(''),
        debounceTime(150),
        distinctUntilChanged(),
        map((specialist) => (specialist.name ? specialist.name : specialist))
      ),
      this.qualityService.getAllQualityListSpecialist()
    ).pipe(
      map(([formValue, specialists]) => {

        const filter = specialists.filter((el) =>el.name.toLowerCase().includes(formValue.toLowerCase())
        );

        if (!(filter.length === 1 && filter[0]['name'] === formValue) &&
          formValue.length
        ) {
          this.specialistForm.get('specialist').setErrors({ invalid: true });
        }

        return filter;
      })
    );

    this.filteredBroadcast$ = this.qualityService.getAllBroadcastList().pipe(
      tap((res: QualityBroadcastList[]) => {
        return res;
      })
    );

    this.resultEvaluation$ = combineLatest(
      this.specialistForm.get('quality').valueChanges.pipe(),
      this.specialistForm.get('cost').valueChanges.pipe(),
      this.specialistForm.get('frequency').valueChanges.pipe()
    ).pipe(
      map(([formQuality, formCost, formFrequency]) => {
        const codeQuality = formQuality.code;
        const codeCost = formCost.code;
        const codeFrecuency = formFrequency.code;

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
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.specialistForm = this.fb.group({
      specialist: [null, Validators.required],
      quality: ['', Validators.required],
      cost: ['', Validators.required],
      frequency: ['', Validators.required],
    });
  }

  save(): void {
    try {
      if (this.specialistForm.valid) {
        const resp = this.qualityService.saveQualitySpecialist(
          this.data,
          this.specialistForm.value,
          this.emailArray,
          this.state,
          this.resultAnalysis,
          this.evaluationName ,
        );
        this.loading.next(true);
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {
              batch
                .commit()
                .then(() => {
                  this.loading.next(false);
                  this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
                    duration: 6000,
                  });
                  //this.dialogRef.close();
                  this.dialog.closeAll();
                })
                .catch((err) => {
                  this.loading.next(false);
                  this.snackbar.open('🚨 Hubo un error al crear!', 'Aceptar', {
                    duration: 6000,
                  });
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

  removeEmail(email: string): void {
    const index = this.emailArray.indexOf(email);

    if (index >= 0) {
      this.emailArray.splice(index, 1);
    }
  }
  addBroadcast(event: MatChipInputEvent): void {
    const input = event.input;
    console.log('input :', input);
    const value = event.value;
    console.log('value :', value);

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

    this.emailInput.nativeElement.value = '';
    this.broadcastControl.setValue(null);
  }

  showEntrySpecialist(specialist: EvaluationsUser): string | null {
    return specialist ? specialist.name : null;
  }

  selectedEntrySpecialist(event: any): void {
    const emailSpecialist = event.option.value.email;
    this.emailArray.push(emailSpecialist);

    this.selectedSpecialist.next(event.option.value);
    this.actualSpecialist = event.option.value;
  }
  /*  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  } */
}
