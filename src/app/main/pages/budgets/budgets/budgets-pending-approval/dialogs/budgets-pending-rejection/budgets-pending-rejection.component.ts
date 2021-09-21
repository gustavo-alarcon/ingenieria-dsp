import { Component, OnInit, Inject } from '@angular/core';
import { BudgetsService } from '../../../../../../services/budgets.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {
  Budget,
  RejectionReasonsEntry,
} from '../../../../../../models/budgets.model';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { startWith, map, take } from 'rxjs/operators';
import { AuthService } from '../../../../../../../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-budgets-pending-rejection',
  templateUrl: './budgets-pending-rejection.component.html',
  styleUrls: ['./budgets-pending-rejection.component.scss'],
})
export class BudgetsPendingRejectionComponent implements OnInit {
  rejectionFormGroup: FormGroup;
  woMain: number = 0;
  woChild: number | null = null;

  rejectionReasonControl = new FormControl('');

  rejectionReasonList$: Observable<RejectionReasonsEntry[]>;

  // Loaders
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loading.asObservable();

  constructor(
    private budgetsService: BudgetsService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Budget,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.woChild = this.data.woChild;
    this.woMain = this.data.woMain;

    this.rejectionFormGroup = this.formBuilder.group({
      rejectionReason: ['', Validators.required],
      detailReason: [''],
    });

    this.rejectionReasonList$ = combineLatest(
      this.budgetsService.getAllReasonsForRejectionEntries(),
      this.rejectionFormGroup.get('rejectionReason').valueChanges.pipe(
        startWith(''),
        map((value: RejectionReasonsEntry | string) =>
          typeof value === 'string'
            ? value.toLowerCase()
            : value['name'].toLowerCase()
        )
      )
    ).pipe(
      map(([list, search]) => {
        return list.filter((element) => {
          return element.name.toLowerCase().includes(search);
        });
      })
    );
  }

  saveRejection() {
    if (this.rejectionFormGroup.valid) {
      this.loading.next(true);

      this.authService.user$.pipe(take(1)).subscribe((user) => {
        this.budgetsService
          .updateRejectionReason(
            this.data.id,
            this.rejectionFormGroup.value,
            'PPTO. RECHAZADO',
            user
          )
          .subscribe((batch: firebase.default.firestore.WriteBatch) => {
            batch.commit().then(() => {
              this.loading.next(false);
              this.matSnackBar.open(
                ' ✅ Archivo se rechazo de forma correcta',
                'Aceptar',
                {
                  duration: 6000,
                }
              );
              this.dialog.closeAll();
            });
          });
      });
    }
  }

  showRejection(value: RejectionReasonsEntry): string | null {
    return value ? value.name : null;
  }
}
