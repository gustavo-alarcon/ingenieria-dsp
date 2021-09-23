import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasicCause } from 'src/app/main/models/workshop.model';
import { QualityService } from 'src/app/main/services/quality.service';

@Component({
  selector: 'app-delete-immediate-cause-dialog',
  templateUrl: './delete-immediate-cause-dialog.component.html',
  styleUrls: ['./delete-immediate-cause-dialog.component.scss'],
})
export class DeleteImmediateCauseDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BasicCause,
    private qualityService: QualityService,
    public dialogRef: MatDialogRef<DeleteImmediateCauseDialogComponent>
  ) {}

  ngOnInit(): void {}

  deleteBasicCause(): void {
    this.qualityService.updateBasicCause(this.data);
    this.dialogRef.close(true);
  }
}
