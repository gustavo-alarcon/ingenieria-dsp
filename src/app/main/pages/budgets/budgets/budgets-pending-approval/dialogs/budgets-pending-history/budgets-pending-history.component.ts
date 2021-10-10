import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Budget, BudgetHistoryDate } from 'src/app/main/models/budgets.model';
import { BudgetsService } from '../../../../../../services/budgets.service';


@Component({
  selector: 'app-budgets-pending-history',
  templateUrl: './budgets-pending-history.component.html',
  styleUrls: ['./budgets-pending-history.component.scss']
})
export class BudgetsPendingHistoryComponent implements OnInit {

  panelOpenState = false;

  dateArray: BudgetHistoryDate[] = [];


  constructor(private budgetsService: BudgetsService,
    @Inject(MAT_DIALOG_DATA) public budget: Budget
  ) { }

  ngOnInit(): void {
    this.dateArray = this.budgetsService.getDateHistory(this.budget);
  }

}
