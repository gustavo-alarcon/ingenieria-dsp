import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsObservationDialogComponent } from './dialogs/requests-observation-dialog/requests-observation-dialog.component';
import { RequestsSettingDialogComponent } from './dialogs/requests-setting-dialog/requests-setting-dialog.component';
import { RequestsStartDialogComponent } from './dialogs/requests-start-dialog/requests-start-dialog.component';
import { RequestsTimeLineDialogComponent } from './dialogs/requests-time-line-dialog/requests-time-line-dialog.component';
import { Evaluation } from '../../../models/evaluations.model';
import { Observable, combineLatest } from 'rxjs';
import { tap, map, startWith, filter, share } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../auth/services/auth.service';
import { EvaluationsService } from '../../../services/evaluations.service';



@Component({
  selector: 'app-evaluations-requests',
  templateUrl: './evaluations-requests.component.html',
  styleUrls: ['./evaluations-requests.component.scss']
})
export class EvaluationsRequestsComponent implements OnInit {

  evaluation$: Observable<Evaluation[]>;
  tallerList$: Observable<Evaluation[]>;
  dataEvaluations: Evaluation[] = [];
  counter: number;
  searchForm: FormGroup;
  tallerForm: FormGroup;
  state = 'registered';

  tallerObservable$: Observable<[any, Evaluation[]]>
  tallerSelected: boolean  = false;


  constructor(
             public dialog: MatDialog,
             private fb: FormBuilder,
             private snackbar: MatSnackBar,
             private auth: AuthService,
             private  evaltService: EvaluationsService,
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
     //this.evaltService.getAllEvaluations(),
     this.evaltService.getAllEvaluationsByInternalStatus(this.state),
       this.searchForm.get('ot').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.internalStatus.toLowerCase())),
     
    ).pipe(
      map(([evaluations, name  ]) => {
        console.log('evaluations : ', evaluations);
        console.log('name : ', name);
        return evaluations.filter(el => name ? el.otMain.toLowerCase().includes(name) : true);
      }),
      tap(res => {
          console.log('evaluations : ', res);
          this.dataEvaluations = res;
          this.counter = this.dataEvaluations.length;
          return  this.dataEvaluations;
      })
    )
  }
  showTaller(taller: any): string | null {
    return taller ? taller.workshop : null
  }

  settingDialog(): void{
    this.dialog.open(RequestsSettingDialogComponent, {
      width: '35%',
    });
   }

  initDialog(item: Evaluation): void{
    this.dialog.open(RequestsStartDialogComponent, {
      width: '40%',
      data:item
    });
  }
  obsDialog(item): void{
    this.dialog.open(RequestsObservationDialogComponent, {
      width: '40%',
      data:item
    });
  }
  timeline(item): void{
    this.dialog.open(RequestsTimeLineDialogComponent, {
      width: '90%',
      data:item

    });
  }

}
