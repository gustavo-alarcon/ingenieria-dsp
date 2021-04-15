import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { Quality } from '../../../../models/quality.model';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { QualityService } from '../../../../services/quality.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { debounceTime, filter, startWith, map, tap } from 'rxjs/operators';
import { ConfigurationsDialogComponent } from './dialogs/configurations-dialog/configurations-dialog.component';
import { DetailInternalDialogComponent } from './dialogs/detail-internal-dialog/detail-internal-dialog.component';
import { DetailExternalDialogComponent } from './dialogs/detail-external-dialog/detail-external-dialog.component';
import { TimeLineDialogComponent } from './dialogs/time-line-dialog/time-line-dialog.component';
import { AnalysisDialogComponent } from './dialogs/analysis-dialog/analysis-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  quality$: Observable<Quality[]>;
  dataQuality: Quality[] = [];
  counter: number;
  searchControl = new FormControl('');
  state = 'process';

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
    private fb: FormBuilder,
    private qualityService: QualityService,
    private auth: AuthService
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
            String(quality.workShop).toLowerCase().includes(searchTerm)  ||
            String(quality.partNumber).toLowerCase().includes(searchTerm) ||
            String(quality.enventDetail).toLowerCase().includes(searchTerm)  ||
            String(quality.packageNumber).toLowerCase().includes(searchTerm) ||
            String(quality.miningOperation).toLowerCase().includes(searchTerm) ||
            String(quality.componentHourMeter).toLowerCase().includes(searchTerm);
          });
        }

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

          evaluation.processTimer = setInterval(function EvalInterval() {
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
  analysis(item): void {
    this.dialog.open(AnalysisDialogComponent, {
      maxWidth: 620,
      width: '90vw',
      data: item
    });
  }

}
