import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-budgets-summary-delete-dialog',
  templateUrl: './budgets-summary-delete-dialog.component.html',
  styleUrls: ['./budgets-summary-delete-dialog.component.scss'],
})
export class BudgetsSummaryDeleteDialogComponent implements OnInit {
  woMain: number = 0;
  woChild: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<BudgetsSummaryDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.woChild = this.data.woChild;
    this.woMain = this.data.woMain;
  }

  public confirmDelete() {
    this.dialogRef.close('delete');
  }
}
