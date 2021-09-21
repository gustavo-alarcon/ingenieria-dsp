import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkshopModel } from 'src/app/main/models/workshop.model';
import { QualityService } from 'src/app/main/services/quality.service';

@Component({
  selector: 'app-delete-process-dialog',
  templateUrl: './delete-process-dialog.component.html',
  styleUrls: ['./delete-process-dialog.component.scss'],
})
export class DeleteProcessDialogComponent implements OnInit {
  process: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WorkshopModel,
    private qualityService: QualityService,
    public dialogRef: MatDialogRef<DeleteProcessDialogComponent>
  ) {}

  ngOnInit(): void {}

  deleteProcess(): void {
    this.qualityService.updateWorkshopProcess(this.data);
    this.dialogRef.close();
  }
}
