import { Budget } from './../../../../../../models/budgets.model';
import { Component, Inject, OnInit } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BudgetHistoryDate } from '../../../../../../models/budgets.model';
import { BudgetsService } from '../../../../../../services/budgets.service';

@Component({
  selector: 'app-pending-send-timeline-dialog',
  templateUrl: './pending-send-timeline-dialog.component.html',
  styleUrls: ['./pending-send-timeline-dialog.component.scss'],
})
export class PendingSendTimelineDialogComponent implements OnInit {

  dateArray: BudgetHistoryDate[] = []
  constructor(
    private budgetsService: BudgetsService,
               @Inject(MAT_DIALOG_DATA) public budget: Budget
  ) {}

  public ngOnInit(): void {
    this.dateArray = this.budgetsService.getDateHistory(this.budget);
  }



  
}
