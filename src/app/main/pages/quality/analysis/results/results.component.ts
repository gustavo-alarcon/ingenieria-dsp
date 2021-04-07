import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Quality } from 'src/app/main/models/quality.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { QualityService } from '../../../../services/quality.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  settingsDataSource = new MatTableDataSource<Quality>();
  settingsDisplayedColumns: string[] = [
    'date',
    'eventType',
    'workOrder',
    'component',
    'numberPart',
    'workShop',
    'specialist',
    'accCorrective',
    'riskLevel',
    'user',
    'state',
    'actions',
  ];
  @ViewChild('settingsPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.settingsDataSource.paginator = paginator;
  }

  quality$: Observable<Quality[]>;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private qualityService: QualityService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.quality$ = this.qualityService.getAllQuality().pipe(
      tap((res: Quality[]) => {
        console.log('Quality', res);
        this.settingsDataSource.data = res;
      })
    );
  }
}
