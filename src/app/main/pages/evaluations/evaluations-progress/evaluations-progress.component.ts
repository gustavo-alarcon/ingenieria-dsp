import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
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
    private auth: AuthService
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
      this.workshopControl.valueChanges.pipe(startWith('')),
      this.auth.getGeneralConfig()
    ).pipe(
      map(([evaluations, search, workshopCodes, generalConfig]) => {
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

        // console.log(preFilterSearch[0].createdAt['seconds']);
        preFilterSearch.map(evaluation => {
          if (evaluation.processTimer) {
            clearInterval(evaluation.processTimer);
          }

          let registryDay
          let registryHours
          let registryMinutes
          let registrySeconds
          let registryTotalMilliseconds

          if (evaluation.registryTimeElapsed) {
            // Time calcultaions for registry
            registryDay = evaluation.registryTimeElapsed.days * (1000 * 60 * 60 * 24);
            registryHours = evaluation.registryTimeElapsed.hours * (1000 * 60 * 60);
            registryMinutes = evaluation.registryTimeElapsed.minutes * (1000 * 60);
            registrySeconds = evaluation.registryTimeElapsed.seconds * (1000);
            registryTotalMilliseconds = registryDay + registryHours + registryMinutes + registrySeconds;
          }

          let processDistance = 0;

          evaluation.processTimer = setInterval(() => {
            // Get today's date and time
            let now = new Date().getTime();


            let process = evaluation.processAt ? evaluation.processAt['seconds'] * 1000 : now;
            // Find the distance between now and the count down date
            processDistance = now - process;

            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(processDistance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((processDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((processDistance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((processDistance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            evaluation.processTimeElapsed = {
              days: days,
              hours: hours,
              minutes: minutes,
              seconds: seconds
            }

            // Time calcultaions for limit
            let limitDay = generalConfig.processTimer.days * (1000 * 60 * 60 * 24);
            let limitHours = generalConfig.processTimer.hours * (1000 * 60 * 60);
            let limitMinutes = generalConfig.processTimer.minutes * (1000 * 60);
            let limitTotalMilliseconds = limitDay + limitHours + limitMinutes;

            let processPercentageElapsed = processDistance / limitTotalMilliseconds;
            evaluation.processPercentageElapsed = 100 - (Math.ceil(processPercentageElapsed * 100) > 100 ? 100 : Math.ceil(processPercentageElapsed * 100));

            // Time calculation for total attention
            let attentionDays = Math.floor((processDistance + registryTotalMilliseconds) / (1000 * 60 * 60 * 24));
            let attentionHours = Math.floor(((processDistance + registryTotalMilliseconds) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let attentionMinutes = Math.floor(((processDistance + registryTotalMilliseconds) % (1000 * 60 * 60)) / (1000 * 60));
            let attentionSeconds = Math.floor(((processDistance + registryTotalMilliseconds) % (1000 * 60)) / 1000);

            evaluation.attentionTimeElapsed = {
              days: attentionDays,
              hours: attentionHours,
              minutes: attentionMinutes,
              seconds: attentionSeconds
            }

          }, 5000)
        });

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
