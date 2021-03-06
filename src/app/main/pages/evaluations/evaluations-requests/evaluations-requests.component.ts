import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsObservationDialogComponent } from './dialogs/requests-observation-dialog/requests-observation-dialog.component';
import { RequestsSettingDialogComponent } from './dialogs/requests-setting-dialog/requests-setting-dialog.component';
import { RequestsStartDialogComponent } from './dialogs/requests-start-dialog/requests-start-dialog.component';
import { RequestsTimeLineDialogComponent } from './dialogs/requests-time-line-dialog/requests-time-line-dialog.component';
import { Evaluation } from '../../../models/evaluations.model';
import { Observable, combineLatest, BehaviorSubject, config } from 'rxjs';
import { tap, map, startWith, filter, debounceTime } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EvaluationsService } from '../../../services/evaluations.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-evaluations-requests',
  templateUrl: './evaluations-requests.component.html',
  styleUrls: ['./evaluations-requests.component.scss'],
})
export class EvaluationsRequestsComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  evaluation$: Observable<Evaluation[]>;
  dataEvaluations: Evaluation[] = [];
  counter: number;
  searchForm: FormGroup;
  state = 'registered';

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
      this.evaltService.getAllEvaluationsByInternalStatus(this.state),
      this.searchForm.get('ot').valueChanges.pipe(
        debounceTime(300),
        filter(input => input !== null),
        startWith<any>('')),
      this.workshopControl.valueChanges.pipe(startWith('')),
      this.auth.getGeneralConfig()
    ).pipe(
      map(([evaluations, search, workshopCodes, generalConfig]) => {
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
              String(evaluation.wof).toLowerCase().includes(searchTerm) ||
              String(evaluation.partNumber).toLowerCase().includes(searchTerm);
          });
        } else {
          preFilterSearch = evaluations.filter(evaluation => {
            return String(evaluation.otMain).toLowerCase().includes(searchTerm) ||
              String(evaluation.otChild).toLowerCase().includes(searchTerm) ||
              String(evaluation.wof).toLowerCase().includes(searchTerm) ||
              String(evaluation.partNumber).toLowerCase().includes(searchTerm);
          })
        }

        // console.log(preFilterSearch[0].createdAt['seconds']);
        preFilterSearch.map(evaluation => {
          if (evaluation.registryTimer) {
            clearInterval(evaluation.registryTimer);
          }

          evaluation.registryTimer = setInterval(() => {
            // Get today's date and time
            let now = new Date().getTime();
            let registry = evaluation.createdAt['seconds'] * 1000;
            // Find the distance between now and the count down date
            let distance = now - registry;

            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            evaluation.registryTimeElapsed = {
              days: days,
              hours: hours,
              minutes: minutes,
              seconds: seconds
            }

            // Time calcultaions for limit
            let limitDay = generalConfig.registryTimer.days * (1000 * 60 * 60 * 24);
            let limitHours = generalConfig.registryTimer.hours * (1000 * 60 * 60);
            let limitMinutes = generalConfig.registryTimer.minutes * (1000 * 60);
            let limitTotalMilliseconds = limitDay + limitHours + limitMinutes;

            let registryPercentageElapsed = distance / limitTotalMilliseconds;
            evaluation.registryPercentageElapsed = 100 - (Math.ceil(registryPercentageElapsed * 100) > 100 ? 100 : Math.ceil(registryPercentageElapsed * 100));

            evaluation.attentionTimeElapsed = {
              days: days,
              hours: hours,
              minutes: minutes,
              seconds: seconds
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
    this.dialog.open(RequestsSettingDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  initDialog(item: Evaluation): void {
    this.dialog.open(RequestsStartDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: item,
    });
  }

  obsDialog(item): void {
    this.dialog.open(RequestsObservationDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: item,
    });
  }

  timeline(item): void {
    this.dialog.open(RequestsTimeLineDialogComponent, {
      width: '90vw',
      data: item
    });
  }
}
