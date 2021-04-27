import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Quality } from '../../../../../../models/quality.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-acc-corrective-dialog',
  templateUrl: './acc-corrective-dialog.component.html',
  styleUrls: ['./acc-corrective-dialog.component.scss']
})
export class AccCorrectiveDialogComponent implements OnInit {
  
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  settingsDataSource = new MatTableDataSource<any>();
  settingsDisplayedColumns: string[] = [
    'order',
    'dateStart',
    'accCorrective',
    'areaResponsable',
    'state',
    'dateEnd',
    'user',
    'evidence',
  ];
  @ViewChild('settingsPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.settingsDataSource.paginator = paginator;
  }

  constructor(
    public dialogRef: MatDialogRef<AccCorrectiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality,

  ) { }
  ngOnInit(): void {
    this.settingsDataSource.data = this.data.correctiveActions;

  }


}
