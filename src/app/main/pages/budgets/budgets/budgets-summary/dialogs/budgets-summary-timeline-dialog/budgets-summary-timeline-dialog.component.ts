import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BudgetHistoryDate, Budget } from '../../../../../../models/budgets.model';
import { BudgetsService } from '../../../../../../services/budgets.service';

@Component({
  selector: 'app-budgets-summary-timeline-dialog',
  templateUrl: './budgets-summary-timeline-dialog.component.html',
  styleUrls: ['./budgets-summary-timeline-dialog.component.scss']
})
export class BudgetsSummaryTimelineDialogComponent implements OnInit {

  dateArray: BudgetHistoryDate[] = []

  constructor(private budgetsService: BudgetsService,
    @Inject(MAT_DIALOG_DATA) public budget: Budget) { }

  ngOnInit(): void {
    this.dateArray = this.budgetsService.getDateHistory(this.budget);
  }

}
