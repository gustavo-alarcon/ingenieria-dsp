import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evaluation } from '../../../../../models/evaluations.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { EvaluationsService } from '../../../../../services/evaluations.service';

@Component({
  selector: 'app-history-image-dialog',
  templateUrl: './history-image-dialog.component.html',
  styleUrls: ['./history-image-dialog.component.scss']
})
export class HistoryImageDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<HistoryImageDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private  evaltService: EvaluationsService,) { }

  ngOnInit(): void {
  }
  save(): void{

  }

}
