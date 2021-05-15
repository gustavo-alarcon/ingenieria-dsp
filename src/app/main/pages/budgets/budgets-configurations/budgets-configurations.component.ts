import { AddGroupDialogComponent } from './dialogs/add-group-dialog/add-group-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  modificationReasonEntry,
  rejectionReasonsEntry,
} from './../../../models/budgets.model';
import { MyErrorStateMatcher } from './../../evaluations/evaluations-settings/evaluations-settings.component';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { BudgetsService } from 'src/app/main/services/budgets.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/main/models/user-model';

@Component({
  selector: 'app-budgets-configurations',
  templateUrl: './budgets-configurations.component.html',
  styleUrls: ['./budgets-configurations.component.scss'],
})
export class BudgetsConfigurationsComponent implements OnInit {
  // Loaders
  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public loading$: Observable<boolean> = this.loading.asObservable();

  // Form controllers
  public listReasonsForRejectionFormControl: FormControl = new FormControl(
    null,
    Validators.required
  );

  public listReasonsForModificationFormControl: FormControl = new FormControl(
    null,
    Validators.required
  );

  // Matchers
  public matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  // Data
  public listReasonsForRejectionArray: Array<rejectionReasonsEntry> = [];
  public listReasonsForModificationArray: Array<modificationReasonEntry> = [];

  public reasonsForModification$: Observable<Array<modificationReasonEntry>>;

  // Current User
  public user: User;

  // Subscription
  private subscription: Subscription = new Subscription();

  constructor(
    private budgetService: BudgetsService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.loading.next(true);

    // Get the current user
    this.subscription.add(
      this.authService.user$.pipe(take(1)).subscribe((user: User) => {
        this.user = user;
      })
    );

    // Get all the entries for the list ReasonsForRejection
    this.subscription.add(
      this.budgetService
        .getAllReasonsForRejectionEntries()
        .subscribe((resp) => {
          if (resp) {
            this.listReasonsForRejectionArray = resp;
          } else {
            this.listReasonsForRejectionArray = [];
          }
        })
    );

    // Get all the entries for the list ReasonsForModification
    this.subscription.add(
      this.budgetService
        .getAllReasonsForModificationEntries()
        .subscribe((resp) => {
          if (resp) {
            this.listReasonsForModificationArray = resp;
          } else {
            this.listReasonsForModificationArray = [];
          }
        })
    );

    this.reasonsForModification$ =
      this.budgetService.getAllReasonsForModificationEntries();

    this.loading.next(false);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public saveReasonsForRejection(): void {
    try {
      const resp = this.budgetService.addReasonForRejectionEntry(
        this.listReasonsForRejectionArray,
        this.user
      );
      this.loading.next(true);
      this.subscription.add(
        resp.subscribe((batch) => {
          if (batch) {
            batch
              .commit()
              .then(() => {
                this.loading.next(false);
                this.snackbar.open(
                  '✅ Lista razones de rechazo creada!',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              })
              .catch((error: any) => {
                this.loading.next(false);
                this.snackbar.open(
                  '🚨 Hubo un error creando la lista razones de rechazo!',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              });
          }
        })
      );
    } catch (error: any) {
      console.error(error);
    }
  }

  public saveReasonsForModification(): void {
    try {
      const resp = this.budgetService.addReasonForModificationEntry(
        this.listReasonsForModificationArray,
        this.user
      );
      this.loading.next(true);
      this.subscription.add(
        resp.subscribe((batch) => {
          if (batch) {
            batch
              .commit()
              .then(() => {
                this.loading.next(false);
                this.snackbar.open(
                  '✅ Lista razones de modificación creada!',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              })
              .catch((error: any) => {
                this.loading.next(false);
                this.snackbar.open(
                  '🚨 Hubo un error creando la lista razones de modificación!',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              });
          }
        })
      );
    } catch (error: any) {
      console.error(error);
    }
  }

  public async addOrDeleteEntryInReasonsForRejectionList(
    action: string,
    index?: number
  ): Promise<void> {
    switch (action) {
      case 'add': {
        // Add an item to the local ReasonsForRejection array
        if (this.listReasonsForRejectionFormControl.valid) {
          const temp: rejectionReasonsEntry = {
            id: null,
            name: this.listReasonsForRejectionFormControl.value.trim(),
            createdBy: null,
            createdAt: null,
          };

          // Searching for repeated values
          const equal = (currentItem: rejectionReasonsEntry) =>
            currentItem.name !== temp.name;
          if (this.listReasonsForRejectionArray.every(equal)) {
            this.listReasonsForRejectionArray.unshift(temp);
          }
          // Reset the text in the form control
          this.listReasonsForRejectionFormControl.reset();
        }

        break;
      }
      case 'delete': {
        // Check if the item exists in the db
        if (this.listReasonsForRejectionArray[index].id) {
          this.loading.next(true);
          await this.budgetService.deleteReasonsForRejectionEntry(
            this.listReasonsForRejectionArray[index].id
          );
          this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
            duration: 6000,
          });
          this.loading.next(false);
        }

        /// Delete an item from the local ReasonsForRejection array
        this.listReasonsForRejectionArray.splice(index, 1);
        break;
      }
    }
  }

  public async addOrDeleteEntryInReasonsForModificationList(
    action: string,
    index?: number
  ): Promise<void> {
    switch (action) {
      case 'add': {
        // Add an item to the local ReasonsForModification array
        if (this.listReasonsForModificationFormControl.valid) {
          const temp: modificationReasonEntry = {
            id: null,
            name: this.listReasonsForModificationFormControl.value.trim(),
            createdBy: null,
            createdAt: null,
          };

          // Searching for repeated values
          const equal = (currentItem: modificationReasonEntry) =>
            currentItem.name !== temp.name;
          if (this.listReasonsForModificationArray.every(equal)) {
            this.listReasonsForModificationArray.unshift(temp);
          }
          // Reset the text in the form control
          this.listReasonsForModificationFormControl.reset();
        }

        break;
      }
      case 'delete': {
        // Check if the item exists in the db
        if (this.listReasonsForModificationArray[index].id) {
          this.loading.next(true);
          await this.budgetService.deleteReasonsForModificationEntry(
            this.listReasonsForModificationArray[index].id
          );
          this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
            duration: 6000,
          });
          this.loading.next(false);
        }

        /// Delete an item from the local ReasonsForModification array
        this.listReasonsForModificationArray.splice(index, 1);
        break;
      }
    }
  }

  public addGroup(): void {
    this.dialog.open(AddGroupDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }
}
