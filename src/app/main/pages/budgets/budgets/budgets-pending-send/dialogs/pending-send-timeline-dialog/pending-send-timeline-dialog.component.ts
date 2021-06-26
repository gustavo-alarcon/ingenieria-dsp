import { Budget } from './../../../../../../models/budgets.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';

@Component({
  selector: 'app-pending-send-timeline-dialog',
  templateUrl: './pending-send-timeline-dialog.component.html',
  styleUrls: ['./pending-send-timeline-dialog.component.scss'],
})
export class PendingSendTimelineDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PendingSendTimelineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public budget: Budget
  ) {}

  public ngOnInit(): void {}

  get lastListDate(): string {
    return this.getStringFromTimestamp(this.budget.fechaUltimoListado);
  }

  get lastADMDocumentSentDate(): string {
    return this.getStringFromTimestamp(
      this.budget.fechaUltimoEnvioDocumentoADM
    );
  }

  get lastBudgetSentDate(): string {
    return this.getStringFromTimestamp(this.budget.fechaUltimoEnvioPPTO);
  }

  get lastInputDate(): string {
    return this.getStringFromTimestamp(this.budget.fechaUltimoInput);
  }

  get fisrtLabourDate(): string {
    return this.getStringFromTimestamp(this.budget.fechaFirstLabour);
  }

  get lastLabourDate(): string {
    return this.getStringFromTimestamp(this.budget.fechaLastLabour);
  }

  get workshopBillingDate(): string {
    return this.getStringFromTimestamp(this.budget.fechaDeFactDeTaller);
  }

  get definitionOfChargesDate(): string {
    return this.getStringFromTimestamp(this.budget.fechaDefinicionDeCargos);
  }

  get approvedOrRejectedDate(): string {
    return this.getStringFromTimestamp(this.budget.fechaDeAprobacionORechazo);
  }

  private getStringFromTimestamp(timestamp: any): string {
    const seconds: any = timestamp;

    // If date is unvalid or doesn't exist
    if (seconds == null || seconds.seconds <= 0) return '---';

    const date: string = moment
      .utc(seconds.seconds * 1000)
      .format('DD/MM/YYYY');

    return date;
  }
}
