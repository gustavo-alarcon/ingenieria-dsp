import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsObservationDialogComponent } from './dialogs/requests-observation-dialog/requests-observation-dialog.component';
import { RequestsSettingDialogComponent } from './dialogs/requests-setting-dialog/requests-setting-dialog.component';
import { RequestsStartDialogComponent } from './dialogs/requests-start-dialog/requests-start-dialog.component';
import { RequestsTimeLineDialogComponent } from './dialogs/requests-time-line-dialog/requests-time-line-dialog.component';
import { Evaluation } from '../../../models/evaluations.model';
import { Observable, combineLatest, BehaviorSubject, config, Subscription } from 'rxjs';
import { tap, map, startWith, filter, debounceTime } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EvaluationsService } from '../../../services/evaluations.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RequestsCreateDialogComponent } from './dialogs/requests-create-dialog/requests-create-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-evaluations-requests',
  templateUrl: './evaluations-requests.component.html',
  styleUrls: ['./evaluations-requests.component.scss'],
})
export class EvaluationsRequestsComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  evaluation$: Observable<Evaluation[]>;
  dataEvaluations: Evaluation[] = [];
  counter: number;
  searchControl = new FormControl('');
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
        '201301411',
        '5'], location: 'MSH'
    },
    {
      code: [
        '201306412',
        '201306413',
        '201306415',
        '201306409',
        '201306411'], location: 'TMM'
    },
    {
      code: [
        '1'], location: 'CRC LIMA'
    },
    {
      code: [
        '2',], location: 'CRC LA JOYA'
    },
    {
      code: [
        '3'], location: 'TMAQ LIMA'
    },
    {
      code: [
        '4',], location: 'TH'
    },
    {
      code: [
        '6',], location: 'TMAQ LA JOYA'
    }
  ];

  subscriptions = new Subscription();
  isMobile = false;


  constructor(
    private breakpoint: BreakpointObserver,
    public dialog: MatDialog,
    private evaltService: EvaluationsService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      })
    )

    this.evaluation$ = combineLatest(
      this.evaltService.getAllEvaluationsByInternalStatus(this.state),
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        filter(input => input !== null),
        startWith<any>('')),
      this.workshopControl.valueChanges.pipe(startWith('')),
      this.authService.getGeneralConfig()
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
              String(evaluation.wof).toLowerCase().includes(searchTerm) ||
              String(evaluation.partNumber).toLowerCase().includes(searchTerm) ||
              String(evaluation.description).toLowerCase().includes(searchTerm);
          });
        } else {
          preFilterSearch = evaluations.filter(evaluation => {
            return String(evaluation.otMain).toLowerCase().includes(searchTerm) ||
              String(evaluation.otChild).toLowerCase().includes(searchTerm) ||
              String(evaluation.wof).toLowerCase().includes(searchTerm) ||
              String(evaluation.partNumber).toLowerCase().includes(searchTerm) ||
              String(evaluation.description).toLowerCase().includes(searchTerm);
          })
        }

        preFilterSearch.map(evaluation => {
          if (evaluation.registryTimer) {
            clearInterval(evaluation.registryTimer);
          }

          evaluation.registryTimer = setInterval(function evalInterval() {
            // Get today's date and time
            const now = new Date().getTime();
            const registry = evaluation.createdAt['seconds'] * 1000;
            // Find the distance between now and the count down date
            const distance = now - registry;

            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            evaluation.registryTimeElapsed = {
              days: days,
              hours: hours,
              minutes: minutes,
              seconds: seconds
            };

            // Time calcultaions for limit
            const limitDay = generalConfig.registryTimer.days * (1000 * 60 * 60 * 24);
            const limitHours = generalConfig.registryTimer.hours * (1000 * 60 * 60);
            const limitMinutes = generalConfig.registryTimer.minutes * (1000 * 60);
            const limitTotalMilliseconds = limitDay + limitHours + limitMinutes;
            const registryPercentageElapsed = distance / limitTotalMilliseconds;

            evaluation.registryPercentageElapsed = 100 - (Math.ceil(registryPercentageElapsed * 100) > 100 ? 100 : Math.ceil(registryPercentageElapsed * 100));

            evaluation.attentionTimeElapsed = {
              days: days,
              hours: hours,
              minutes: minutes,
              seconds: seconds
            };

            return evalInterval

          }(), 120000);
        });

        preFilterSearch.map(evaluation => {
          let match = false;
          this.evaltService.priorityList.every(element => {
            match = element === evaluation.description;
            return !match
          });

          if (match) {
            evaluation['priority'] = 1;
          } else {
            evaluation['priority'] = 0;
          }
        });

        preFilterSearch.sort((a, b) => {
          return b['priority'] - a['priority']
        })


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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

  create(): void {
    this.dialog.open(RequestsCreateDialogComponent, {
      width: '500px',
      maxWidth: '90vw'
    });
  }


}
