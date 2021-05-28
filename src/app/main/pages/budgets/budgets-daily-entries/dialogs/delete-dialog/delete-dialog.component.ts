import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  id: string = this.data.currentWOCHILD;

  ngOnInit(): void {}

  public confirmDelete() {
    this.dialogRef.close('delete');
  }
}
