import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
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

        const searchTerm = search.toLowerCase().trim();
        let preFilterEventType: Quality[] = [];
        let preFilterSearch: Quality[] = [...qualities];

        if (codeEventType) {
          preFilterEventType = qualities.filter(quality => quality.eventType === codeEventType);

          preFilterSearch = preFilterEventType.filter(quality => {
            return String(quality.workOrder).toLowerCase().includes(searchTerm) ||
            String(quality.component).toLowerCase().includes(searchTerm) ||
            String(quality.specialist['name']).toLowerCase().includes(searchTerm) ||
            String(quality.workShop).toLowerCase().includes(searchTerm)  ||
            String(quality.partNumber).toLowerCase().includes(searchTerm) ||
            String(quality.enventDetail).toLowerCase().includes(searchTerm)  ||
            String(quality.packageNumber).toLowerCase().includes(searchTerm) ||
            String(quality.miningOperation).toLowerCase().includes(searchTerm) ||
            String(quality.componentHourMeter).toLowerCase().includes(searchTerm);
          });
        } else {
          preFilterSearch = qualities.filter(quality => {
            return String(quality.workOrder).toLowerCase().includes(searchTerm) ||
            String(quality.component).toLowerCase().includes(searchTerm) ||
            String(quality.specialist['name']).toLowerCase().includes(searchTerm) ||
            String(quality.workShop).toLowerCase().includes(searchTerm)  ||
            String(quality.partNumber).toLowerCase().includes(searchTerm) ||
            String(quality.enventDetail).toLowerCase().includes(searchTerm)  ||
            String(quality.packageNumber).toLowerCase().includes(searchTerm) ||
            String(quality.miningOperation).toLowerCase().includes(searchTerm) ||
            String(quality.componentHourMeter).toLowerCase().includes(searchTerm);
          });
        }
        // total task pending
        this.totalTask = 0;
        preFilterSearch.map((el) => {
          if (el.taskDone < el.correctiveActions.length) {
            const result = el.correctiveActions.length - el.taskDone;
            this.totalTask += result;
          }
        });

        preFilterSearch.map(quality => {
          if (quality.tracingTimer) {
            clearInterval(quality.tracingTimer);
          }

          let registryDay;
          let registryHours;
          let registryMinutes;
          let registrySeconds;
          let registryTotalMilliseconds;

          if (quality.registryTimeElapsed) {
            // Time calcultaions for registry
            registryDay = quality.registryTimeElapsed.days * (1000 * 60 * 60 * 24);
            registryHours = quality.registryTimeElapsed.hours * (1000 * 60 * 60);
            registryMinutes = quality.registryTimeElapsed.minutes * (1000 * 60);
            registrySeconds = quality.registryTimeElapsed.seconds * (1000);
            registryTotalMilliseconds = registryDay + registryHours + registryMinutes + registrySeconds;
          }

          let processDay;
          let processHours;
          let processMinutes;
          let processSeconds;
          let processTotalMilliseconds;

          if (quality.processTimeElapsed) {
            // Time calcultaions for registry
            processDay = quality.processTimeElapsed.days * (1000 * 60 * 60 * 24);
            processHours = quality.processTimeElapsed.hours * (1000 * 60 * 60);
            processMinutes = quality.processTimeElapsed.minutes * (1000 * 60);
            processSeconds = quality.processTimeElapsed.seconds * (1000);
            processTotalMilliseconds = processDay + processHours + processMinutes + processSeconds;
          }

          let tracingDistance = 0;

          quality.tracingTimer = setInterval(function EvalInterval() {
            // Get today's date and time
            const now = new Date().getTime();


            const tracing = quality.tracingAt ? quality.tracingAt['seconds'] * 1000 : now;
            // Find the distance between now and the count down date
            tracingDistance = now - tracing;

            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(tracingDistance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((tracingDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((tracingDistance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((tracingDistance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            quality.tracingTimeElapsed = {
              days: days,
              hours: hours,
              minutes: minutes,
              seconds: seconds
            }

            // Time calcultaions for limit
            const limitDay = generalConfig.tracingTimer.days * (1000 * 60 * 60 * 24);
            const limitHours = generalConfig.tracingTimer.hours * (1000 * 60 * 60);
            const limitMinutes = generalConfig.tracingTimer.minutes * (1000 * 60);
            const limitTotalMilliseconds = limitDay + limitHours + limitMinutes;

            const tracingPercentageElapsed = tracingDistance / limitTotalMilliseconds;
            quality.processPercentageElapsed = 100 - (Math.ceil(tracingPercentageElapsed * 100) > 100 ? 100 : Math.ceil(tracingPercentageElapsed * 100));

            // Time calculation for total attention
            const attentionDays = Math.floor((tracingDistance + processTotalMilliseconds + registryTotalMilliseconds) / (1000 * 60 * 60 * 24));
            const attentionHours = Math.floor(((tracingDistance + processTotalMilliseconds + registryTotalMilliseconds) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const attentionMinutes = Math.floor(((tracingDistance + processTotalMilliseconds + registryTotalMilliseconds) % (1000 * 60 * 60)) / (1000 * 60));
            const attentionSeconds = Math.floor(((tracingDistance + processTotalMilliseconds + registryTotalMilliseconds) % (1000 * 60)) / 1000);

            quality.attentionTimeElapsed = {
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
    this.subscriptions.unsubscribe();
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
