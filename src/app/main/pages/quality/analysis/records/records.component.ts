import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { Evaluation } from '../../../../models/evaluations.model';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { QualityService } from 'src/app/main/services/quality.service';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { ConfigurationsComponent } from './dialogs/configurations/configurations.component';
import { Quality, WorkshopList } from '../../../../models/quality.model';
import { AssignSpecialistDialogComponent } from './dialogs/assign-specialist-dialog/assign-specialist-dialog.component';
import { DetailExternalDialogComponent } from './dialogs/detail-external-dialog/detail-external-dialog.component';
import { TimeLineDialogComponent } from './dialogs/time-line-dialog/time-line-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DetailInternalDialogComponent } from './dialogs/detail-internal-dialog/detail-internal-dialog.component';
import { WorkshopModel } from 'src/app/main/models/workshop.model';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent implements OnInit {
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
  state = 'registered';

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
            if (quality.registryTimer) {
              clearInterval(quality.registryTimer);
            }

            quality.registryTimer = setInterval(
              (function recordsInterval() {
                // Get today's date and time
                const now = new Date().getTime();
                const registry = quality.createdAt['seconds'] * 1000;
                // Find the distance between now and the count down date
                const distance = now - registry;

                // Time calculations for days, hours, minutes and seconds
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                  (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                  (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Output the result in an element with id="demo"
                quality.registryTimeElapsed = {
                  days: days,
                  hours: hours,
                  minutes: minutes,
                  seconds: seconds,
                };

                // Time calcultaions for limit
                const limitDay =
                  generalConfig.registryTimer.days * (1000 * 60 * 60 * 24);
                const limitHours =
                  generalConfig.registryTimer.hours * (1000 * 60 * 60);
                const limitMinutes =
                  generalConfig.registryTimer.minutes * (1000 * 60);
                const limitTotalMilliseconds =
                  limitDay + limitHours + limitMinutes;
                const registryPercentageElapsed =
                  distance / limitTotalMilliseconds;

                quality.registryPercentageElapsed =
                  100 -
                  (Math.ceil(registryPercentageElapsed * 100) > 100
                    ? 100
                    : Math.ceil(registryPercentageElapsed * 100));

                quality.attentionTimeElapsed = {
                  days: days,
                  hours: hours,
                  minutes: minutes,
                  seconds: seconds,
                };

                return recordsInterval;
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
    this.dialog.open(ConfigurationsComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  assignSpecialist(item: Evaluation): void {
    this.dialog.open(AssignSpecialistDialogComponent, {
      maxWidth: 600,
      width: '90vw',
      data: item,
    });
  }

  detailDialog(item: Quality, value: string): void {
    console.log('value : ', value);
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

  timeline(item): void {
    this.dialog.open(TimeLineDialogComponent, {
      width: '90vw',
      data: item,
    });
  }
}
