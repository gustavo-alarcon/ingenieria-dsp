import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { Evaluation } from 'src/app/main/models/evaluations.model';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';

import { EvaluationsConsultsDialogComponent } from './dialogs/evaluations-consults-dialog/evaluations-consults-dialog.component';
import { EvaluationsFinalizeDialogComponent } from './dialogs/evaluations-finalize-dialog/evaluations-finalize-dialog.component';
import { EvaluationsImagesDialogComponent } from './dialogs/evaluations-images-dialog/evaluations-images-dialog.component';
// tslint:disable-next-line: max-line-length
import { EvaluationsObservationsDialogComponent } from './dialogs/evaluations-observations-dialog/evaluations-observations-dialog.component';
import { EvaluationsResponseDialogComponent } from './dialogs/evaluations-response-dialog/evaluations-response-dialog.component';
import { EvaluationsSettingsDialogComponent } from './dialogs/evaluations-settings-dialog/evaluations-settings-dialog.component';
import { EvaluationsTimeLineDialogComponent } from './dialogs/evaluations-time-line-dialog/evaluations-time-line-dialog.component';

@Component({
  selector: 'app-evaluations-progress',
  templateUrl: './evaluations-progress.component.html',
  styleUrls: ['./evaluations-progress.component.scss']
})
export class EvaluationsProgressComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  evaluation$: Observable<Evaluation[]>;
  dataEvaluations: Evaluation[] = [];
  counter: number;
  searchForm: FormGroup;
  state = 'processed';

  workshopControl = new FormControl('');

  workshops = [
    {
      code: [
        '201301412',
        '201301409',
        '201301410',
        '201301413',
        '201301414',
        '201301415',
        '201301411'], location: 'LIMA'
    },
    {
      code: [
        '201306412',
        '201306413',
        '201306415',
        '201306409',
        '201306411'], location: 'LA JOYA'
    }
  ];
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private evaltService: EvaluationsService,
  ) { }


  ngOnInit(): void {
    this.searchForm = this.fb.group({
      ot: null,
    });

    this.evaluation$ = combineLatest(
      this.evaltService.getAllEvaluationsInProcess(),
      this.searchForm.get('ot').valueChanges.pipe(
        debounceTime(300),
        filter(input => input !== null),
        startWith<any>('')),
      this.workshopControl.valueChanges.pipe(startWith(''))
    ).pipe(
      map(([evaluations, search, workshopCodes]) => {
        console.log(search, workshopCodes);
        

        const searchTerm = search.toLowerCase().trim();
        let preFilterWorkshop: Evaluation[] = [];
        let preFilterSearch: Evaluation[] = [...evaluations];

        if (workshopCodes) {
          preFilterWorkshop = evaluations.filter(evaluation => {
            let match = false;
            workshopCodes.every(code => {
              match = String(evaluation.workshop) === code;
              return !match;
            });
            return match;
          });

          preFilterSearch = preFilterWorkshop.filter(evaluation => {
            return String(evaluation.otMain).toLowerCase().includes(searchTerm) ||
              String(evaluation.otChild).toLowerCase().includes(searchTerm) ||
              String(evaluation.partNumber).toLowerCase().includes(searchTerm);
          });
        } else {
          preFilterSearch = evaluations.filter(evaluation => {
            return String(evaluation.otMain).toLowerCase().includes(searchTerm) ||
              String(evaluation.otChild).toLowerCase().includes(searchTerm) ||
              String(evaluation.partNumber).toLowerCase().includes(searchTerm);
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
    );
  }

  settingDialog(): void {
    this.dialog.open(EvaluationsSettingsDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  finalizeDialog(item: Evaluation): void {
    const dialogRef = this.dialog.open(EvaluationsFinalizeDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  imagesDialog(item: Evaluation): void {
    const dialogRef = this.dialog.open(EvaluationsImagesDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  consultDialog(item: Evaluation): void {
    const dialogRef = this.dialog.open(EvaluationsConsultsDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  responseDialog(item: Evaluation): void {
    const dialogRef = this.dialog.open(EvaluationsResponseDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  observationsDialog(item: Evaluation): void {
    this.dialog.open(EvaluationsObservationsDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: item
    });
  }

  timeline(item): void {
    this.dialog.open(EvaluationsTimeLineDialogComponent, {
      width: '90vw',
      data: item
    });
  }

}
