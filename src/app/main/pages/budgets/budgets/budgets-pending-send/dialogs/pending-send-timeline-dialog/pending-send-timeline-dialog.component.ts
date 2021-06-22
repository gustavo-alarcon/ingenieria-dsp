import { Budget } from './../../../../../../models/budgets.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pending-send-timeline-dialog',
  templateUrl: './pending-send-timeline-dialog.component.html',
  styleUrls: ['./pending-send-timeline-dialog.component.scss'],
})
export class PendingSendTimelineDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PendingSendTimelineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Budget
  ) {}

  ngOnInit(): void {}
}
