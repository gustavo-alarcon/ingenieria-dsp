import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pending-send-delete-dialog',
  templateUrl: './pending-send-delete-dialog.component.html',
  styleUrls: ['./pending-send-delete-dialog.component.scss'],
})
export class PendingSendDeleteDialogComponent implements OnInit {
  woMain: number = 0;
  woChild: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<PendingSendDeleteDialogComponent>,
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
