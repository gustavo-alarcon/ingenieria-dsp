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
        '201301411'], location: 'Internos'
    },
    {
      code: [
        '201306412',
        '201306413',
        '201306415',
        '201306409',
        '201306411'], location: 'Externos'
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
      this.workshopControl.valueChanges.pipe(startWith('')),
      this.auth.getGeneralConfig()
    ).pipe(
      map(([quality, search, workshopCodes, generalConfig]) => {
        const searchTerm = search.toLowerCase().trim();
        let preFilterWorkshop: Quality[] = [];
        let preFilterSearch: Quality[] = [...quality];

        /* if (workshopCodes) {
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
              String(evaluation.partNumber).toLowerCase().includes(searchTerm)||
              String(evaluation.description).toLowerCase().includes(searchTerm);
          });
        } else {
          preFilterSearch = evaluations.filter(evaluation => {
            return String(evaluation.otMain).toLowerCase().includes(searchTerm) ||
              String(evaluation.otChild).toLowerCase().includes(searchTerm) ||
              String(evaluation.wof).toLowerCase().includes(searchTerm) ||
              String(evaluation.partNumber).toLowerCase().includes(searchTerm)||
              String(evaluation.description).toLowerCase().includes(searchTerm);
          })
        } */

        preFilterSearch.map(evaluation => {
          if (evaluation.registryTimer) {
            clearInterval(evaluation.registryTimer);
          }

          evaluation.registryTimer = setInterval(() => {
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

  detailDialog(item: Quality, value: string,): void {
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
