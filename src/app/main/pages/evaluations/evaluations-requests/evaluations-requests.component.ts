import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsObservationDialogComponent } from './dialogs/requests-observation-dialog/requests-observation-dialog.component';
import { RequestsSettingDialogComponent } from './dialogs/requests-setting-dialog/requests-setting-dialog.component';
import { RequestsStartDialogComponent } from './dialogs/requests-start-dialog/requests-start-dialog.component';
import { RequestsTimeLineDialogComponent } from './dialogs/requests-time-line-dialog/requests-time-line-dialog.component';
import { Evaluation } from '../../../models/evaluations.model';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { tap, map, startWith, filter, share, debounce, debounceTime } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../auth/services/auth.service';
import { EvaluationsService } from '../../../services/evaluations.service';



@Component({
  selector: 'app-evaluations-requests',
  templateUrl: './evaluations-requests.component.html',
  styleUrls: ['./evaluations-requests.component.scss']
})
export class EvaluationsRequestsComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  evaluation$: Observable<Evaluation[]>;
  tallerList$: Observable<Evaluation[]>;
  dataEvaluations: Evaluation[] = [];
  counter: number;
  searchForm: FormGroup;
  tallerForm: FormGroup;
  state = 'registered';

  tallerObservable$: Observable<[any, Evaluation[]]>
  tallerSelected: boolean = false;

  workshopControl = new FormControl(null);

  workshops = [
    { code: '201301412', name: 'GSP-LIM-DC-SERVICIO TALLER CRC', location: 'LIMA' },
    { code: '201301409', name: 'GSP-LIMA-DA - SERVICIO TALLER DE MÁQUINA', location: 'LIMA' },
    { code: '201301410', name: 'GSP-LIMA-DN -SERVICIO TALLER CARRILERIA', location: 'LIMA' },
    { code: '201301413', name: 'GSP-LIMA-DR - SERVICIO TALLER RECUPERACI', location: 'LIMA' },
    { code: '201301414', name: 'GSP-LIMA-DH - SERVICIO TALLER HIDRAULICO', location: 'LIMA' },
    { code: '201301415', name: 'GSP-LIMA-DO - SERVICIO TALLER SOLDADURA', location: 'LIMA' },
    { code: '201301411', name: 'GSP-LIMA-DE - LABORATORIO DE FLUÍDOS', location: 'LIMA' },
    { code: '201306412', name: 'GSP-LA JOYA-DC - SERVICIO TALLER CRC', location: 'LA JOYA' },
    { code: '201306413', name: 'GSP-LA JOYA-DR - SERVICIO TALLER RECUPER', location: 'LA JOYA' },
    { code: '201306415', name: 'GSP-LA JOYA-DO - SERVICIO TALLER SOLDADU', location: 'LA JOYA' },
    { code: '201306409', name: 'GSP-LA JOYA-DA - SERVICIO TALLER DE MÁQU', location: 'LA JOYA' },
    { code: '201306411', name: 'GSP-LA JOYA-DE- LABORATORIO DE FLUÍDOS', location: 'LA JOYA' }
  ]

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private evaltService: EvaluationsService,
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      ot: null,
    });

    /* this.tallerObservable$ = combineLatest(
      this.tallerForm.valueChanges.pipe(startWith('')),
      this.evaltService.getAllEvaluationsByInternalStatus(this.state)
    ).pipe(share());
    
    this.tallerList$ = this.tallerObservable$.pipe(map(([formValue, tallers]) => {
      console.log('formValue : ',formValue)
      console.log('tallers : ',tallers)
      // sanitazing form input
      let cleanFormValue = formValue.name ? formValue.name : '';
      // Flagging category selection
      this.tallerSelected = formValue.name ? true : false;

      let filter = tallers.filter(el => {
        return el.workshop.toLocaleLowerCase().includes(cleanFormValue.toLocaleLowerCase());
      });

      if (!(filter.length == 1 && filter[0] === formValue) && formValue.length) {
        this.tallerForm.setErrors({ invalid: true });
      }
      return filter;
    })); */

    /* this.taller$ = this.evaltService.getAllEvaluationsByInternalStatus(this.state).pipe(
      tap(res => {
        if (res) {
          this.dataEvaluations = res;
        }

      })
    ) */

    this.evaluation$ = combineLatest(
      this.evaltService.getAllEvaluationsByInternalStatus(this.state),
      this.searchForm.get('ot').valueChanges.pipe(
        debounceTime(300),
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.internalStatus.toLowerCase()),
        tap(rs => {
          this.loading.next(true);
        })),
      this.workshopControl.valueChanges.pipe(startWith(''))
    ).pipe(
      map(([evaluations, name, workshop]) => {

        let searchTerm = name.toLowerCase();
        let preFilterSearch = [...evaluations];

        if (workshop.code) {
          let preFilterWorkshop = evaluations.filter(evaluation => evaluation.workshop === workshop.code);

          preFilterSearch = preFilterWorkshop.filter(evaluation => {
            return String(evaluation.otMain).toLowerCase().includes(searchTerm) ||
            String(evaluation.otChild).toLowerCase().includes(searchTerm)
          })
        } else {
          preFilterSearch = evaluations.filter(evaluation => {
            return String(evaluation.otMain).toLowerCase().includes(searchTerm) ||
            String(evaluation.otChild).toLowerCase().includes(searchTerm)
          })
        }

        return preFilterSearch;
      }),
      tap(res => {
        this.dataEvaluations = res;
        this.counter = this.dataEvaluations.length;
        this.loading.next(false);
        return this.dataEvaluations;
      })
    )
  }
  showTaller(taller: any): string | null {
    return taller ? taller.workshop : null
  }

  settingDialog(): void {
    this.dialog.open(RequestsSettingDialogComponent, {
      width: '35%',
    });
  }

  initDialog(item: Evaluation): void {
    this.dialog.open(RequestsStartDialogComponent, {
      width: '30%',
      data: item
    });
  }
  obsDialog(item): void {
    this.dialog.open(RequestsObservationDialogComponent, {
      width: '35%',
      data: item
    });
  }
  timeline(item): void {
    this.dialog.open(RequestsTimeLineDialogComponent, {
      width: '90%',
      data: item

    });
  }

}
