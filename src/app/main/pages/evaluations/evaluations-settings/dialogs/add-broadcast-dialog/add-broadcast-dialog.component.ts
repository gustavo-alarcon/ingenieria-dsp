import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/main/models/user-model';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-broadcast-dialog',
  templateUrl: './add-broadcast-dialog.component.html',
  styleUrls: ['./add-broadcast-dialog.component.scss']
})
export class AddBroadcastDialogComponent implements OnInit {

  broadcastForm: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  user: User;

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private evalService: EvaluationsService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,

  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.subscription.add(
      this.auth.user$.subscribe((user) => {
        this.user = user;
      })
    );

    this.broadcastForm = this.fb.group({
      broadcast: ['', Validators.required],
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  save(): void {
    if (this.broadcastForm.valid) {
      const resp = this.evalService.addNewBrodcastList(
        this.broadcastForm.get('broadcast').value,
        this.user
      );
      this.loading.next(true);
      this.subscription.add(
        resp.subscribe((batch) => {
          if (batch) {
            batch
              .commit()
              .then(() => {
                // this.loading.next(false);
                this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
                  duration: 6000,
                });
                this.dialog.closeAll();
              })
              .catch((err) => {
                this.loading.next(false);
                this.snackbar.open('🚨 Hubo un error al crear!', 'Aceptar', {
                  duration: 6000,
                });
              });
          }
        })
      );
    }

  }
}
