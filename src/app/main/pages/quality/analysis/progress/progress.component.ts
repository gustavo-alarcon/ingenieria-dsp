import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { Quality, WorkshopList } from '../../../../models/quality.model';
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

import jsPDF from 'jspdf';
import { WorkshopModel } from 'src/app/main/models/workshop.model';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  quality$: Observable<Quality[]>;
  responsibleWorkshopList$: Observable<WorkshopList[]>;
  reportingWorkshopList$: Observable<WorkshopModel[]>;
  dataQuality: Quality[] = [];
  counter: number;
  searchControl = new FormControl('');
  responsibleWorkshopControl = new FormControl('');
  reportingWorkshopControl = new FormControl('');
  state = 'process';

  eventTypeControl = new FormControl('');

  eventType = [
    {
      code: 'Interno',
      event: 'Internos',
    },
    {
      code: 'Externo',
      event: 'Externos',
    },
  ];

  subscriptions = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private qualityService: QualityService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.breakpoint
        .observe([Breakpoints.HandsetPortrait])
        .subscribe((res) => {
          if (res.matches) {
            this.isMobile = true;
          } else {
            this.isMobile = false;
          }
        })
    );

    this.reportingWorkshopList$ =
      this.qualityService.getAllQualityInternalWorkshop();

    this.responsibleWorkshopList$ = this.qualityService.getAllWorkshopList();

    this.quality$ = combineLatest(
      this.qualityService.getAllQualityByState(this.state),
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        filter((input) => input !== null),
        startWith('')
      ),
      this.reportingWorkshopControl.valueChanges.pipe(startWith('')),
      this.responsibleWorkshopControl.valueChanges.pipe(startWith('')),
      this.eventTypeControl.valueChanges.pipe(startWith('')),
      this.authService.getGeneralConfigQuality()
    ).pipe(
      map(
        ([
          qualities,
          search,
          reportingWorkshop,
          responsibleWorkshop,
          codeEventType,
          generalConfig,
        ]) => {
          const searchTerm = search.toLowerCase().trim();
          let preFilterEventType: Quality[] = [];
          let preFilterReportingWorkshop: Quality[] = [];
          let preFilterResponsibleWorkshop: Quality[] = [];
          let preFilterSearch: Quality[] = [...qualities];

          preFilterEventType = qualities.filter((quality) => {
            if (codeEventType === '') return true;
            return quality.eventType === codeEventType;
          });

          preFilterReportingWorkshop = preFilterEventType.filter((quality) => {
            if (reportingWorkshop === '') return true;
            return quality.reportingWorkshop
              ? quality.reportingWorkshop.workshopName ===
                  reportingWorkshop['workshopName']
              : false;
          });

          preFilterResponsibleWorkshop = preFilterReportingWorkshop.filter(
            (quality) => {
              if (responsibleWorkshop === '') return true;
              return quality.workShop
                ? quality.workShop === responsibleWorkshop['name']
                : false;
            }
          );
          preFilterSearch = preFilterResponsibleWorkshop.filter((quality) => {
            return (
              String(quality.workOrder).toLowerCase().includes(searchTerm) ||
              String(quality.component).toLowerCase().includes(searchTerm) ||
              String(quality.specialist['name'])
                .toLowerCase()
                .includes(searchTerm) ||
              String(quality.workShop).toLowerCase().includes(searchTerm) ||
              String(quality.partNumber).toLowerCase().includes(searchTerm) ||
              String(quality.enventDetail).toLowerCase().includes(searchTerm) ||
              String(quality.packageNumber)
                .toLowerCase()
                .includes(searchTerm) ||
              String(quality.miningOperation)
                .toLowerCase()
                .includes(searchTerm) ||
              String(quality.componentHourMeter)
                .toLowerCase()
                .includes(searchTerm)
            );
          });

          preFilterSearch.map((quality) => {
            if (quality.processTimer) {
              clearInterval(quality.processTimer);
            }

            let registryDay;
            let registryHours;
            let registryMinutes;
            let registrySeconds;
            let registryTotalMilliseconds;

            if (quality.registryTimeElapsed) {
              // Time calcultaions for registry
              registryDay =
                quality.registryTimeElapsed.days * (1000 * 60 * 60 * 24);
              registryHours =
                quality.registryTimeElapsed.hours * (1000 * 60 * 60);
              registryMinutes =
                quality.registryTimeElapsed.minutes * (1000 * 60);
              registrySeconds = quality.registryTimeElapsed.seconds * 1000;
              registryTotalMilliseconds =
                registryDay + registryHours + registryMinutes + registrySeconds;
            }

            let processDistance = 0;

            quality.processTimer = setInterval(
              (function progressInterval() {
                // Get today's date and time
                const now = new Date().getTime();

                const process = quality.processAt
                  ? quality.processAt['seconds'] * 1000
                  : now;
                // Find the distance between now and the count down date
                processDistance = now - process;

                // Time calculations for days, hours, minutes and seconds
                const days = Math.floor(
                  processDistance / (1000 * 60 * 60 * 24)
                );
                const hours = Math.floor(
                  (processDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                  (processDistance % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor(
                  (processDistance % (1000 * 60)) / 1000
                );

                // Output the result in an element with id="demo"
                quality.processTimeElapsed = {
                  days: days,
                  hours: hours,
                  minutes: minutes,
                  seconds: seconds,
                };

                // Time calcultaions for limit
                const limitDay =
                  generalConfig.processTimer.days * (1000 * 60 * 60 * 24);
                const limitHours =
                  generalConfig.processTimer.hours * (1000 * 60 * 60);
                const limitMinutes =
                  generalConfig.processTimer.minutes * (1000 * 60);
                const limitTotalMilliseconds =
                  limitDay + limitHours + limitMinutes;

                const processPercentageElapsed =
                  processDistance / limitTotalMilliseconds;
                quality.processPercentageElapsed =
                  100 -
                  (Math.ceil(processPercentageElapsed * 100) > 100
                    ? 100
                    : Math.ceil(processPercentageElapsed * 100));

                // Time calculation for total attention
                const attentionDays = Math.floor(
                  (processDistance + registryTotalMilliseconds) /
                    (1000 * 60 * 60 * 24)
                );
                const attentionHours = Math.floor(
                  ((processDistance + registryTotalMilliseconds) %
                    (1000 * 60 * 60 * 24)) /
                    (1000 * 60 * 60)
                );
                const attentionMinutes = Math.floor(
                  ((processDistance + registryTotalMilliseconds) %
                    (1000 * 60 * 60)) /
                    (1000 * 60)
                );
                const attentionSeconds = Math.floor(
                  ((processDistance + registryTotalMilliseconds) %
                    (1000 * 60)) /
                    1000
                );

                quality.attentionTimeElapsed = {
                  days: attentionDays,
                  hours: attentionHours,
                  minutes: attentionMinutes,
                  seconds: attentionSeconds,
                };
                return progressInterval;
              })(),
              120000
            );
          });

          return preFilterSearch;
        }
      ),
      tap((res) => {
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
      data: item,
    };
    let dialogRef;

    switch (value) {
      case 'Interno':
        dialogRef = this.dialog.open(
          DetailInternalDialogComponent,
          optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'Externo':
        dialogRef = this.dialog.open(
          DetailExternalDialogComponent,
          optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }

  printPdf(item: Quality) {
    this.qualityService.printQualityPdf(item);
  }

  timeline(item): void {
    this.dialog.open(TimeLineDialogComponent, {
      width: '90vw',
      data: item,
    });
  }
  analysis(item): void {
    this.dialog.open(AnalysisDialogComponent, {
      maxWidth: 620,
      width: '90vw',
      data: item,
      disableClose: true,
    });
  }
}
