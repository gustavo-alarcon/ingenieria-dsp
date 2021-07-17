import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
  AbstractControl,
  ControlContainer,
} from '@angular/forms';
import {
  ModificationReasonEntry,
  Budget,
} from '../../../../../../models/budgets.model';
import { combineLatest, Observable, pipe, BehaviorSubject } from 'rxjs';
import { BudgetsService } from '../../../../../../services/budgets.service';
import { filter, map, startWith, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { element } from 'protractor';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-budgets-pending-modify',
  templateUrl: './budgets-pending-modify.component.html',
  styleUrls: ['./budgets-pending-modify.component.scss'],
})
export class BudgetsPendingModifyComponent implements OnInit {
  modificationFormGroup: FormGroup;

  additionalsDropDownOptions = [
    { value: 'parallel', viewValue: 'Paralelo' },
    { value: 'budget', viewValue: 'Presupuesto' },
  ];

  firstModificationDocsStamp;
  firstAdditionalDocsStamp;

  // Loaders
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loading.asObservable();

  selectable: boolean = true;
  removable: boolean = true;

  modificationReasonControl = new FormControl('');

  modificationReasonList: Observable<ModificationReasonEntry[]>;

  constructor(
    private budgetService: BudgetsService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Budget,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.modificationReasonList = combineLatest(
      this.budgetService.getAllReasonsForModificationEntries(),
      this.modificationReasonControl.valueChanges.pipe(
        startWith(''),
        map((value: ModificationReasonEntry | string) =>
          typeof value === 'string'
            ? value.toLowerCase()
            : value['name'].toLowerCase()
        )
      )
    ).pipe(
      map(([list, search]) => {
        return list.filter((element) =>
          element.name.toLowerCase().includes(search)
        );
      })
    );

    //  console.log(element.name);

    this.modificationFormGroup = this.formBuilder.group({
      modificationReason: ['', Validators.required],
      additionals: this.formBuilder.array([], Validators.required),
    });
  }

  saveChanges(): void {
    if (
      this.data.motivoDeModificacion02 != undefined &&
      this.data.motivoDeModificacion03 != undefined &&
      this.data.motivoDeModificacion04 != undefined
    ) {
      this.matSnackBar.open(
        ' 🚨 No puede superar las 3 modificaciones',
        'Aceptar',
        {
          duration: 6000,
        }
      );
      this.dialog.closeAll();
      return;
    }

    if (this.modificationFormGroup.valid) {
      this.loading.next(true);

      if (this.budgetService.updateModifyReason)
        this.authService.user$.pipe(take(1)).subscribe((user) => {
          this.budgetService
            .updateModifyReason(
              this.data.id,
              this.modificationFormGroup.value,
              this.data,
              user
            )
            .subscribe((batch: firebase.default.firestore.WriteBatch) => {
              batch.commit().then(() => {
                this.loading.next(false);

                this.matSnackBar.open(
                  ' ✅ Archivo se modifico de forma correcta',
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

  showModification(value: ModificationReasonEntry): string | null {
    return value ? value.name : null;
  }

  get additionalForms(): FormArray {
    return this.modificationFormGroup.get('additionals') as FormArray;
  }

  addAdditional(): void {
    const form = this.formBuilder.group({
      type: ['parallel', Validators.required],
      observations: [''],
    });

    this.additionalForms.push(form);
  }

  deleteAdditional(i: number) {
    this.additionalForms.removeAt(i);
  }

  notSelectedValidator(control: AbstractControl): { [key: string]: boolean } {
    console.log(control.value);

    if (typeof control.value === 'string' && control.value !== '') {
      return { notSelected: true };
    } else {
      return null;
    }
  }
}
