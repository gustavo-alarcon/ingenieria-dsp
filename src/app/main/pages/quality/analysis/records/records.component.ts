import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Evaluation } from '../../../../models/evaluations.model';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { QualityService } from 'src/app/main/services/quality.service';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { ConfigurationsComponent } from './dialogs/configurations/configurations.component';
import { Quality } from '../../../../models/quality.model';
import { AssignSpecialistDialogComponent } from './dialogs/assign-specialist-dialog/assign-specialist-dialog.component';
import { DetailExternalDialogComponent } from './dialogs/detail-external-dialog/detail-external-dialog.component';
import { DetailInternalDialogComponent } from './dialogs/detail-internal-dialog/detail-internal-dialog.component';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  quality$: Observable<Quality[]>;
  dataQuality: Quality[] = [];
  counter: number;
  searchForm: FormGroup;
  state = 'registered';

  eventTypeControl = new FormControl('');

  eventType = [
    {
      code: 'Internal', event: 'Internos'
    },
    {
      code: 'External', event: 'Externos'
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
      this.qualityService.getAllQualityRecords(),
      this.searchForm.get('ot').valueChanges.pipe(
        debounceTime(300),
        filter(input => input !== null),
        startWith<any>('')),
      this.eventTypeControl.valueChanges.pipe(startWith('')),
      this.auth.getGeneralConfig()
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
    this.dialog.open(ConfigurationsComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  assignSpecialist(item: Evaluation): void {
    this.dialog.open(AssignSpecialistDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: item,
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
      case 'Internal':
        dialogRef = this.dialog.open(DetailInternalDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'External':
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
    this.dialog.open(ConfigurationsComponent, {
      width: '90vw',
      data: item
    });
  }


}
