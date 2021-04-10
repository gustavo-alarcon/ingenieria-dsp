import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
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

@Component({
  selector: 'app-tracing',
  templateUrl: './tracing.component.html',
  styleUrls: ['./tracing.component.scss']
})
export class TracingComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  quality$: Observable<Quality[]>;
  dataQuality: Quality[] = [];
  counter: number;
  searchForm: FormGroup;
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

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private qualityService: QualityService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      ot: null,
    });

    this.quality$ = combineLatest(
      this.qualityService.getAllQualityByState(this.state),
      this.searchForm.get('ot').valueChanges.pipe(
        debounceTime(300),
        filter(input => input !== null),
        startWith<any>('')),
      this.eventTypeControl.valueChanges.pipe(startWith('')),
      this.auth.getGeneralConfig()
    ).pipe(
      map(([qualities, search, codeEventType, generalConfig]) => {
        // total task pending
        this.totalTask = 0;
        qualities.map(el => {
          if (el.taskDone < el.correctiveActions.length ) {
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
              String(quality.workShop).toLowerCase().includes(searchTerm) ;
          });
        } else {
          preFilterSearch = qualities.filter(quality => {
            return  String(quality.workOrder).toLowerCase().includes(searchTerm) ||
            String(quality.component).toLowerCase().includes(searchTerm) ||
            String(quality.workShop).toLowerCase().includes(searchTerm) ;
          });
        }

        preFilterSearch.map(quality => {
          if (quality.registryTimer) {
            clearInterval(quality.registryTimer);
          }

          quality.registryTimer = setInterval(() => {
            // Get today's date and time
            const now = new Date().getTime();
            const registry = quality.createdAt['seconds'] * 1000;
            // Find the distance between now and the count down date
            const distance = now - registry;

            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            quality.registryTimeElapsed = {
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

            quality.registryPercentageElapsed = 100 - (Math.ceil(registryPercentageElapsed * 100) > 100 ? 100 : Math.ceil(registryPercentageElapsed * 100));

            quality.attentionTimeElapsed = {
              days: days,
              hours: hours,
              minutes: minutes,
              seconds: seconds
            };

          }, 5000);
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
  accCorrective(item): void{
    this.dialog.open(AccCorrectiveDialogComponent, {
      maxWidth: 900,
      width: '90vw',
      data: item
    });
  }
  reports(item): void{
    this.dialog.open(ReportsDialogComponent, {
      maxWidth: 900,
      width: '90vw',
      data: item
    });
  }

}
