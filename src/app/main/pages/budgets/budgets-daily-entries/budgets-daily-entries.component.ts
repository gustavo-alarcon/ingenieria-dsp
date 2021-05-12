import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Evaluation } from '../../../models/evaluations.model';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-budgets-daily-entries',
  templateUrl: './budgets-daily-entries.component.html',
  styleUrls: ['./budgets-daily-entries.component.scss'],
})
export class BudgetsDailyEntriesComponent implements OnInit {
  public budgetsDailyEntriesDataSource: MatTableDataSource<Evaluation> =
    new MatTableDataSource<Evaluation>();

  public budgetsDailyEntriesDisplayedColumns: string[] = [
    'otMain',
    'otChild',
    'position',
    'partNumber',
    'description',
    'quantity',
    'status',
    'createdBy',
    'wof',
    'task',
    'observations',
    'workshop',
    'createdAt',
    'result',
    'kindOfTest',
    'comments',
    'finalizedBy',
    'processAt',
    'finalizedAt',
  ];

  @ViewChild('budgetsDailyEntriesPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.budgetsDailyEntriesDataSource.paginator = paginator;
  }

  public subscriptions: Subscription = new Subscription();
  public isMobile: boolean = false;

  constructor(private breakpoint: BreakpointObserver) {}

  public ngOnInit(): void {
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
  }

  public loadFile(fileList: File[]): void {
    const file: File = fileList[0];
    const fileReader: FileReader = new FileReader();

    fileReader.onload = () => {
      const data: Uint8Array = new Uint8Array(fileReader.result as ArrayBufferLike);
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
      // SheetNames[0] should contain the data. For some reason SheetNames[1] contains the data
      const sheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[1]];
      // Empty headers [H5]
      console.log(sheet.B5, sheet.C5, sheet.H5);
    };

    fileReader.readAsArrayBuffer(file);
  }

  editDialog(): void {}
  deleteDialog(): void {}
  saveDataTable(): void {}
}
