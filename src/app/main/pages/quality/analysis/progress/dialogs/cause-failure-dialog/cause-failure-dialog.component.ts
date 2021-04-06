import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { QualityService } from 'src/app/main/services/quality.service';

@Component({
  selector: 'app-cause-failure-dialog',
  templateUrl: './cause-failure-dialog.component.html',
  styleUrls: ['./cause-failure-dialog.component.scss']
})
export class CauseFailureDialogComponent implements OnInit {
  form: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private qualityService: QualityService,
        private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.form = this.fb.group({
      causeFailure: ['', Validators.required]
    });
  }
  save(): void{

  }
}
