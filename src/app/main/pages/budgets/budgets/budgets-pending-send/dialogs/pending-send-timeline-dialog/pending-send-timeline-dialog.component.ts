import { Budget } from './../../../../../../models/budgets.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { BudgetHistoryDate } from '../../../../../../models/budgets.model';
import { BudgetsService } from 'src/app/main/services/budgets.service';

@Component({
  selector: 'app-pending-send-timeline-dialog',
  templateUrl: './pending-send-timeline-dialog.component.html',
  styleUrls: ['./pending-send-timeline-dialog.component.scss'],
})
export class PendingSendTimelineDialogComponent implements OnInit {
  dateArray: BudgetHistoryDate[] = []

  constructor( private budgetsService: BudgetsService,
               public dialogRef: MatDialogRef<PendingSendTimelineDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public budget: Budget
  ) {}

  public ngOnInit(): void {
    
    this.dateArray = this.budgetsService.getDateHistory(this.budget);
  }



  // private getStringFromTimestamp(timestamp: any): string {
  //   const seconds: any = timestamp;

  //   // If date is unvalid or doesn't exist
  //   if (seconds == null || seconds.seconds <= 0) return '---';

  //   const date: string = moment
  //     .utc(seconds.seconds * 1000)
  //     .format('DD/MM/YYYY');

  //   return date;
  // }
}
