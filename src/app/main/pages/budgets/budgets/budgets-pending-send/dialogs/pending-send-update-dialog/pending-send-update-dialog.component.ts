import { Budget } from './../../../../../../models/budgets.model';
import { BudgetsService } from './../../../../../../services/budgets.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { BudgetsBroadcastList } from 'src/app/main/models/budgets.model';
import { finalize, map, startWith } from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
@Component({
  selector: 'app-pending-send-update-dialog',
  templateUrl: './pending-send-update-dialog.component.html',
  styleUrls: ['./pending-send-update-dialog.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class PendingSendUpdateDialogComponent implements OnInit {
  // First form
  filesFormGroup: FormGroup;
  // Second form
  form: FormGroup;

  additionalsDropDownOptions = [
    { value: 'parallel', viewValue: 'Paralelo' },
    { value: 'budget', viewValue: 'Presupuesto' },
  ];

  public selectable: boolean = true;
  public removable: boolean = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA, SPACE, TAB];

  public emailCtrl: FormControl = new FormControl();
  public filteredEmails: Observable<string[]>;
  // List of emails that the budget is going to be sent:
  public emails: string[] = [];

  // Broadcast lists
  public broadcastListsNames: string[] = [];
  public broadcastLists: BudgetsBroadcastList[] = [];

  // Loaders
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loading.asObservable();

  // Arrays containing files the user uploaded
  public budgetFilesList: Array<File> = [];
  public reportFilesList: Array<File> = [];
  public quotationFilesList: Array<File> = [];

  public emailsValidation: boolean = false;

  firstCheckboxStamp: CheckboxesI;
  firstAdditionalDocsStamp;

  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  fileUploadCount = new BehaviorSubject<boolean>(false);
  fileUploadCount$ = this.fileUploadCount.asObservable();

  fileSubscriptions = new Subscription();

  // filesUploadPercentageArray: Array<Observable<number>> = [];

  constructor(
    public dialogRef: MatDialogRef<PendingSendUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Budget,
    private _formBuilder: FormBuilder,
    private _budgetService: BudgetsService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private storage: AngularFireStorage,
    private af: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.filesFormGroup = new FormGroup({
      checkboxGroup: new FormGroup(
        {
          afa: new FormControl(false),
          summary: new FormControl(false),
          fesa: new FormControl(false),
          text: new FormControl(false),
          report: new FormControl(false),
          afaObs: new FormControl(''),
          summaryObs: new FormControl(''),
          fesaObs: new FormControl(''),
          textObs: new FormControl(''),
          reportObs: new FormControl(''),
        },
        requireCheckboxesToBeCheckedValidator()
      ),
      additionals: this._formBuilder.array([]),
    });

    // Populate the dialog with know information
    (() => {
      // AFA
      const checkbox = this.filesFormGroup.get('checkboxGroup').get('afa');
      switch (this.data.afa) {
        case 'SI': {
          checkbox.setValue(true);
          break;
        }
        case 'NO': {
          checkbox.setValue(false);
          break;
        }
        default: {
          checkbox.setValue(false);
          break;
        }
      }
    })();

    if (moment(this.data.resumen, 'DD/MM/YYYY').isValid())
      this.filesFormGroup.get('checkboxGroup').get('summary').setValue(true);
    if (moment(this.data.cotizacionFesa, 'DD/MM/YYYY').isValid())
      this.filesFormGroup.get('checkboxGroup').get('fesa').setValue(true);
    if (moment(this.data.cotizacionText, 'DD/MM/YYYY').isValid())
      this.filesFormGroup.get('checkboxGroup').get('text').setValue(true);
    if (moment(this.data.informe, 'DD/MM/YYYY').isValid())
      this.filesFormGroup.get('checkboxGroup').get('report').setValue(true);

    // Populate dialog with all observation fields
    if (this.data.afaObs) {
      this.filesFormGroup
        .get('checkboxGroup')
        .get('afaObs')
        .setValue(this.data.afaObs.toString());
    }
    if (this.data.summaryObs) {
      this.filesFormGroup
        .get('checkboxGroup')
        .get('summaryObs')
        .setValue(this.data.summaryObs.toString());
    }
    if (this.data.fesaObs) {
      this.filesFormGroup
        .get('checkboxGroup')
        .get('fesaObs')
        .setValue(this.data.fesaObs.toString());
    }
    if (this.data.textObs) {
      this.filesFormGroup
        .get('checkboxGroup')
        .get('textObs')
        .setValue(this.data.textObs.toString());
    }
    if (this.data.reportObs) {
      this.filesFormGroup
        .get('checkboxGroup')
        .get('reportObs')
        .setValue(this.data.reportObs.toString());
    }
    // Populate the additional docs
    if (this.data.additionals) {
      this.data.additionals.forEach((doc: any) => {
        this.additionalForms.push(
          this.newAdditionalDocFormGroup(doc.type, doc.typeObs)
        );
      });
    }

    // Create a snapshot of the first values the checkboxes hold
    this.firstCheckboxStamp = this.filesFormGroup.value.checkboxGroup;
    // Create a snapshot of the first additional docs the budget holds
    this.firstAdditionalDocsStamp = this.filesFormGroup.value.additionals;

    this.form = this._formBuilder.group({
      subject: ['', Validators.required],
      body: ['', Validators.required],
      observations: '',
    });

    this._budgetService
      .getAllBroadcastList()
      .subscribe((broadcastLists: BudgetsBroadcastList[]) => {
        broadcastLists.forEach((broadcastList: BudgetsBroadcastList) => {
          this.broadcastLists.push(broadcastList);
          this.broadcastListsNames.push(broadcastList.name);

          this.filteredEmails = this.emailCtrl.valueChanges.pipe(
            startWith(null),
            map((email: string | null) =>
              email ? this._filter(email) : this.broadcastListsNames.slice()
            )
          );
        });
      });
  }

  private newAdditionalDocFormGroup(type: string, typeObs?: string): FormGroup {
    if (!typeObs) {
      typeObs = '';
    }

    return this._formBuilder.group({
      type: [`${type}`, Validators.required],
      typeObs: [`${typeObs}`],
    });
  }

  saveChanges(): void {
    const currentCheckboxes: CheckboxesI =
      this.filesFormGroup.value.checkboxGroup;
    const currentAdditionalDocs = this.filesFormGroup.value.additionals;

    if (this.firstAdditionalDocsStamp !== currentAdditionalDocs) {
      // Update additionals
      this.loading.next(true);
      this._budgetService
        .updateBudgetFields(this.data.id, {
          additionals: currentAdditionalDocs,
        })
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
    }

    // Update checkboxes in the database
    this.updateAfaState(this.firstCheckboxStamp.afa, currentCheckboxes.afa);
    this.updateDocumentState(
      this.firstCheckboxStamp.fesa,
      currentCheckboxes.fesa,
      'cotizacionFesa'
    );
    this.updateDocumentState(
      this.firstCheckboxStamp.report,
      currentCheckboxes.report,
      'informe'
    );
    this.updateDocumentState(
      this.firstCheckboxStamp.summary,
      currentCheckboxes.summary,
      'resumen'
    );
    this.updateDocumentState(
      this.firstCheckboxStamp.text,
      currentCheckboxes.text,
      'cotizacionText'
    );

    // Update the observation fields
    this.updateDocumentObservation(
      this.firstCheckboxStamp.afaObs,
      currentCheckboxes.afaObs,
      'afaObs'
    );
    this.updateDocumentObservation(
      this.firstCheckboxStamp.fesaObs,
      currentCheckboxes.fesaObs,
      'fesaObs'
    );
    this.updateDocumentObservation(
      this.firstCheckboxStamp.textObs,
      currentCheckboxes.textObs,
      'textObs'
    );
    this.updateDocumentObservation(
      this.firstCheckboxStamp.reportObs,
      currentCheckboxes.reportObs,
      'reportObs'
    );
    this.updateDocumentObservation(
      this.firstCheckboxStamp.summaryObs,
      currentCheckboxes.summaryObs,
      'summaryObs'
    );
  }

  private updateDocumentState(
    originalState: boolean,
    finalState: boolean,
    fieldToUpdate: string
  ): void {
    if (originalState !== finalState) {
      // The checkbox state has changed
      if (finalState) {
        // New date to be applied
        this.loading.next(true);
        this._budgetService
          .updateBudgetFields(this.data.id, {
            [fieldToUpdate]: moment().format('DD/MM/YYYY').toString(),
          })
          .subscribe((batch: firebase.default.firestore.WriteBatch) => {
            batch.commit().then(() => {
              this.loading.next(false);
            });
          });
      } else {
        // Mark as pending
        this.loading.next(true);
        this._budgetService
          .updateBudgetFields(this.data.id, {
            [fieldToUpdate]: 'PDTE',
          })
          .subscribe((batch: firebase.default.firestore.WriteBatch) => {
            batch.commit().then(() => {
              this.loading.next(false);
            });
          });
      }
    }
  }

  private updateDocumentObservation(
    originalState: string,
    finalState: string,
    observationFieldName: string
  ): void {
    if (originalState !== finalState) {
      // The observation field has changed
      this.loading.next(true);
      this._budgetService
        .updateBudgetFields(this.data.id, {
          [observationFieldName]: finalState,
        })
        .subscribe((batch: firebase.default.firestore.WriteBatch) => {
          batch.commit().then(() => {
            // The new observation has been applied
            this.loading.next(false);
          });
        });
    }
  }

  private updateAfaState(originalState: boolean, finalState: boolean): void {
    if (originalState !== finalState) {
      // The checkbox state has changed
      if (finalState) {
        this.loading.next(true);
        this._budgetService
          .updateBudgetFields(this.data.id, {
            afa: 'SI',
          })
          .subscribe((batch: firebase.default.firestore.WriteBatch) => {
            batch.commit().then(() => {
              this.loading.next(false);
            });
          });
      } else {
        // Mark as "NO"
        this.loading.next(true);
        this._budgetService
          .updateBudgetFields(this.data.id, {
            afa: 'NO',
          })
          .subscribe((batch: firebase.default.firestore.WriteBatch) => {
            batch.commit().then(() => {
              this.loading.next(false);
            });
          });
      }
    }
  }

  get additionalForms(): FormArray {
    return this.filesFormGroup.get('additionals') as FormArray;
  }

  get subject() {
    return this.form.get('subject');
  }

  get body() {
    return this.form.get('body');
  }

  get observations() {
    return this.form.get('observations');
  }

  public addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our email
    if (value) {
      this.emails.push(value);
    }

    // Reset the input value
    if (event.input) {
      event.input.value = '';
    }

    this.emailCtrl.setValue(null);
  }

  public removeEmail(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  public selectedEmail(event: MatAutocompleteSelectedEvent): void {
    // Get all the emails from the group
    const broadcastList: BudgetsBroadcastList = this.broadcastLists.filter(
      (list) => list.name == event.option.viewValue
    )[0];
    broadcastList.emailList.forEach((email: string) => {
      this.emails.push(email);
    });

    // check this
    this.emailInput.nativeElement.value = '';
    this.emailCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.broadcastListsNames.filter(
      (email) => email.toLowerCase().indexOf(filterValue) === 0
    );
  }

  addAdditional(): void {
    const form = this._formBuilder.group({
      type: ['parallel', Validators.required],
      typeObs: [''],
    });

    this.additionalForms.push(form);
  }

  deleteAdditional(i: number) {
    this.additionalForms.removeAt(i);
  }

  public loadFilesForBudget(fileList: FileList): void {
    this.loading.next(true);
    // Convert FileList to an actual Array
    const fileListArray: File[] = Array.from(fileList);

    fileListArray.forEach((file: File) => {
      this.budgetFilesList.push(file);
    });
    this.loading.next(false);
  }

  public loadFilesForReport(fileList: FileList): void {
    this.loading.next(true);
    // Convert FileList to an actual Array
    const fileListArray: File[] = Array.from(fileList);

    fileListArray.forEach((file: File) => {
      this.reportFilesList.push(file);
    });
    this.loading.next(false);
  }

  public loadFilesForQuotation(fileList: FileList): void {
    this.loading.next(true);
    // Convert FileList to an actual Array
    const fileListArray: File[] = Array.from(fileList);

    fileListArray.forEach((file: File) => {
      this.quotationFilesList.push(file);
    });
    this.loading.next(false);
  }

  public send(): void {
    if (this.budgetFilesList.length === 0 || !this.filesFormGroup.valid) return;

    // first, save form changes
    this.saveChanges();

    // then, initialize the variables for document uploads
    this.loading.next(true);
    const now = Date.now();
    let counter = 0;
    const totalFiles =
      this.budgetFilesList.length +
      this.reportFilesList.length +
      this.quotationFilesList.length;
    const currentVersionCount = this.data.versionCount + 1;
    // for every file in budgetFilesList, we will push a path reference to a budgetPathReferences
    let budgetPathReferences: Array<string> = [];

    this.budgetFilesList.forEach((file) => {
      const filePath = `budgets/${this.data.id}/v${currentVersionCount}/budgets/${now}_${file.name}`;
      const task = this.storage.upload(filePath, file);
      budgetPathReferences.push(filePath);

      this.fileSubscriptions.add(
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.fileUploadCount.next(true);
            })
          )
          .subscribe()
      );
    });

    // for every file in reportFilesList, we will push  a path reference to reportPathReferences
    let reportPathReferences: Array<string> = [];

    this.reportFilesList.forEach((file) => {
      const filePath = `budgets/${this.data.id}/v${currentVersionCount}/reports/${now}_${file.name}`;
      const task = this.storage.upload(filePath, file);
      reportPathReferences.push(filePath);

      this.fileSubscriptions.add(
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.fileUploadCount.next(true);
            })
          )
          .subscribe()
      );
    });

    // for every file in reportFilesList, we will push  a path reference to reportPathReferences
    let quotationPathReferences: Array<string> = [];

    this.quotationFilesList.forEach((file) => {
      const filePath = `budgets/${this.data.id}/v${currentVersionCount}/quotations/${now}_${file.name}`;
      const task = this.storage.upload(filePath, file);
      quotationPathReferences.push(filePath);

      this.fileSubscriptions.add(
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.fileUploadCount.next(true);
            })
          )
          .subscribe()
      );
    });

    // Now, we will keep track of the number of uploads done to unsubscribe and finilize the loaders
    this.fileSubscriptions.add(
      this.fileUploadCount$.subscribe((res) => {
        try {
          if (res) counter++;

          if (counter === totalFiles) {
            this.fileSubscriptions.unsubscribe();

            const batch = this.af.firestore.batch();
            const budgetRef = this.af.doc(
              `db/ferreyros/budgets/${this.data.id}`
            ).ref;

            // TODO: Update budget info
            batch.update(budgetRef, {
              statusPresupuesto: 'PDTE. APROB.',
              versionCount: currentVersionCount,
              documentVersions:
                firebase.default.firestore.FieldValue.arrayUnion({
                  version: this.data.versionCount,
                  budgets: budgetPathReferences,
                  reports: reportPathReferences,
                  quotations: quotationPathReferences,
                }),
              fechaUltimoEnvioPPTO: new Date()
            });

            batch
              .commit()
              .then(() => {
                this.matSnackBar.open('✅ PTTO. enviado con éxito', 'Aceptar', {
                  duration: 6000,
                });
                this.loading.next(false);
                this.dialogRef.close(true);
                // TODO: Send email notifications
              })
              .catch((err) => {
                this.matSnackBar.open(
                  '🚨 Hubo un error guardando los archivos. Por favor, vuelva a intentarlo',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              });
          }
        } catch (error) {
          console.log(error);
        }
      })
    );
  }
}

function requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
  return function validate(formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];

      if (control.value === true) {
        checked++;
      }
    });

    if (checked < minRequired) {
      return {
        requireOneCheckboxToBeChecked: true,
      };
    }

    return null;
  };
}

interface CheckboxesI {
  afa: boolean;
  afaObs: string;
  fesa: boolean;
  fesaObs: string;
  report: boolean;
  reportObs: string;
  summary: boolean;
  summaryObs: string;
  text: boolean;
  textObs: string;
}
