import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/main/models/user-model';

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrls: ['./add-group-dialog.component.scss'],
})
export class AddGroupDialogComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  form: FormGroup;

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loading.asObservable();
  user: User;

  private subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    // Get the current user
    this.subscription.add(
      this.authService.user$.pipe(take(1)).subscribe((user: User) => {
        this.user = user;
      })
    );

    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      broadcast: ['', Validators.required],
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public save() {
    alert('Hello world');
  }
}
