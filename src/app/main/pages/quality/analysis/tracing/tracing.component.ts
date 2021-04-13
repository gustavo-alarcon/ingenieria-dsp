import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { Quality } from 'src/app/main/models/quality.model';
import { QualityService } from 'src/app/main/services/quality.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { AccCorrectiveDialogComponent } from './dialogs/acc-corrective-dialog/acc-corrective-dialog.component';
import { ConfigurationsDialogComponent } from './dialogs/configurations-dialog/configurations-dialog.component';
import { DetailExternalDialogComponent } from './dialogs/detail-external-dialog/detail-external-dialog.component';
import { DetailInternalDialogComponent } from './dialogs/detail-internal-dialog/detail-internal-dialog.component';
import { ReportsDialogComponent } from './dialogs/reports-dialog/reports-dialog.component';
import { TimeLineDialogComponent } from './dialogs/time-line-dialog/time-line-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tracing',
  templateUrl: './tracing.component.html',
  styleUrls: ['./tracing.component.scss']
})
export class TracingComponent implements OnInit, OnDestroy {

  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  quality$: Observable<Quality[]>;
  dataQuality: Quality[] = [];
  counter: number;
  searchControl = new FormControl('');
  state = 'tracing';

  totalTask = 0;

  eventTypeControl = new FormControl('');

  eventType = [
    {
      code: 'Interno', event: 'Internos'
    },
    {
      code: 'Externo', event: 'Externos'
    }
  ];

  subscriptions = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    public dialog: MatDialog,
    private qualityService: QualityService,
    private auth: AuthService,
    private snackbar: MatSnackBar
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
    );

    this.quality$ = combineLatest(
      this.qualityService.getAllQualityByState(this.state),
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        filter(input => input !== null),
        startWith<any>('')),
      this.eventTypeControl.valueChanges.pipe(startWith('')),
      this.auth.getGeneralConfigQuality()
    ).pipe(
      map(([qualities, search, codeEventType, generalConfig]) => {
        // total task pending
        this.totalTask = 0;
        qualities.map(el => {
          if (el.taskDone < el.correctiveActions.length) {
            const result = el.correctiveActions.length - el.taskDone;
            this.totalTask += result;
          }
        });

        const searchTerm = search.toLowerCase().trim();
        let preFilterEventType: Quality[] = [];
        let preFilterSearch: Quality[] = [...qualities];

        if (codeEventType) {
          preFilterEventType = qualities.filter(quality => quality.eventType === codeEventType);

          preFilterSearch = preFilterEventType.filter(quality => {
            return String(quality.workOrder).toLowerCase().includes(searchTerm) ||
              String(quality.component).toLowerCase().includes(searchTerm) ||
              String(quality.workShop).toLowerCase().includes(searchTerm);
          });
        } else {
          preFilterSearch = qualities.filter(quality => {
            return String(quality.workOrder).toLowerCase().includes(searchTerm) ||
              String(quality.component).toLowerCase().includes(searchTerm) ||
              String(quality.workShop).toLowerCase().includes(searchTerm);
          });
        }

        preFilterSearch.map(evaluation => {
          if (evaluation.tracingTimer) {
            clearInterval(evaluation.tracingTimer);
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

          let processDay
          let processHours
          let processMinutes
          let processSeconds
          let processTotalMilliseconds

          if (evaluation.registryTimeElapsed) {
            // Time calcultaions for registry
            processDay = evaluation.processTimeElapsed.days * (1000 * 60 * 60 * 24);
            processHours = evaluation.processTimeElapsed.hours * (1000 * 60 * 60);
            processMinutes = evaluation.processTimeElapsed.minutes * (1000 * 60);
            processSeconds = evaluation.processTimeElapsed.seconds * (1000);
            processTotalMilliseconds = processDay + processHours + processMinutes + processSeconds;
          }

          let tracingDistance = 0;

          evaluation.tracingTimer = setInterval(function EvalInterval() {
            // Get today's date and time
            let now = new Date().getTime();


            let tracing = evaluation.tracingAt ? evaluation.tracingAt['seconds'] * 1000 : now;
            // Find the distance between now and the count down date
            tracingDistance = now - tracing;

            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(tracingDistance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((tracingDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((tracingDistance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((tracingDistance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            evaluation.tracingTimeElapsed = {
              days: days,
              hours: hours,
              minutes: minutes,
              seconds: seconds
            }

            // Time calcultaions for limit
            let limitDay = generalConfig.tracingTimer.days * (1000 * 60 * 60 * 24);
            let limitHours = generalConfig.tracingTimer.hours * (1000 * 60 * 60);
            let limitMinutes = generalConfig.tracingTimer.minutes * (1000 * 60);
            let limitTotalMilliseconds = limitDay + limitHours + limitMinutes;

            let tracingPercentageElapsed = tracingDistance / limitTotalMilliseconds;
            evaluation.processPercentageElapsed = 100 - (Math.ceil(tracingPercentageElapsed * 100) > 100 ? 100 : Math.ceil(tracingPercentageElapsed * 100));

            // Time calculation for total attention
            let attentionDays = Math.floor((tracingDistance + processTotalMilliseconds + registryTotalMilliseconds) / (1000 * 60 * 60 * 24));
            let attentionHours = Math.floor(((tracingDistance + processTotalMilliseconds + registryTotalMilliseconds) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let attentionMinutes = Math.floor(((tracingDistance + processTotalMilliseconds + registryTotalMilliseconds) % (1000 * 60 * 60)) / (1000 * 60));
            let attentionSeconds = Math.floor(((tracingDistance + processTotalMilliseconds + registryTotalMilliseconds) % (1000 * 60)) / 1000);

            evaluation.attentionTimeElapsed = {
              days: attentionDays,
              hours: attentionHours,
              minutes: attentionMinutes,
              seconds: attentionSeconds
            }

            return EvalInterval;

          }(), 5000);
        });

        return preFilterSearch;
      }),
      tap(res => {
        this.dataQuality = res;
        this.counter = this.dataQuality.length;
        this.loading.next(false);
        return this.dataQuality;
      })
    );

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  settingDialog(): void {
    this.dialog.open(ConfigurationsDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  detailDialog(item: Quality, value: string): void {
    const optionsDialog = {
      maxWidth: 500,
      width: '90vw',
      data: item
    };
    let dialogRef;

    switch (value) {
      case 'Interno':
        dialogRef = this.dialog.open(DetailInternalDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'Externo':
        dialogRef = this.dialog.open(DetailExternalDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }

  }

  timeline(item): void {
    this.dialog.open(TimeLineDialogComponent, {
      width: '90vw',
      data: item
    });
  }
  accCorrective(item): void {
    this.dialog.open(AccCorrectiveDialogComponent, {
      maxWidth: 900,
      width: '90vw',
      data: item
    });
  }
  reports(item): void {
    this.dialog.open(ReportsDialogComponent, {
      maxWidth: 900,
      width: '90vw',
      data: item
    });
  }

}
