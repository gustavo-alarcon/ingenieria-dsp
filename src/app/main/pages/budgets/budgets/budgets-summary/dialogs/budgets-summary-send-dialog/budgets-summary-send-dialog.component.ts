import {
  BudgetsBroadcastList,
  Budget,
  DocumentVersion,
  DocumentSent,
} from './../../../../../../models/budgets.model';
import { BudgetsService } from 'src/app/main/services/budgets.service';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize, map, startWith, take } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';

import * as firebase from 'firebase/app';
@Component({
  selector: 'app-budgets-summary-send-dialog',
  templateUrl: './budgets-summary-send-dialog.component.html',
  styleUrls: ['./budgets-summary-send-dialog.component.scss'],
})
export class BudgetsSummarySendDialogComponent implements OnInit {
  public selectable: boolean = true;
  public removable: boolean = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA, SPACE, TAB];

  percentage: Observable<number>;
  downloadURL1: Observable<string>;
  downloadURL2: Observable<string>;
  downloadURL3: Observable<string>;

  doc$: Observable<string>;

  arrayDownload: string[] = [];

  public emailCtrl: FormControl = new FormControl();
  public filteredEmails: Observable<string[]>;
  // List of emails that the budget is going to be sent:
  public emails: string[] = [];

  // Broadcast lists
  public broadcastListsNames: string[] = [];
  public broadcastLists: BudgetsBroadcastList[] = [];

  public subscriptions: Subscription = new Subscription();
  public isMobile: boolean = false;

  // Loaders
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loading.asObservable();

  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  // Arrays containing files the user uploaded
  public budgetFilesList: Array<File> = [];
  public reportFilesList: Array<File> = [];
  public quotationFilesList: Array<File> = [];
  public urls: Array<File> = [];
  public emailsValidation: boolean = false;

  // Form
  form: FormGroup;

  cantidadDeArchivos: number = 0;
  arrayObservablesArchivos: Array<
    Observable<firebase.default.storage.UploadTaskSnapshot>
  > = [];

  lastDocumentsSent: DocumentVersion;
  budgetsSent: Array<DocumentSent> = [];
  reportsSent: Array<DocumentSent> = [];
  quotationsSent: Array<DocumentSent> = [];

  // new variables
  fileUploadCount = new BehaviorSubject<boolean>(false);
  fileUploadCount$ = this.fileUploadCount.asObservable();

  fileSubscriptions = new Subscription();

  budgetEdited = false;
  reportEdited = false;
  quotationEdited = false;

  constructor(
    private _budgetService: BudgetsService,
    private breakpoint: BreakpointObserver,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Budget,
    private storage: AngularFireStorage,
    private dialogRef: MatDialogRef<BudgetsSummarySendDialogComponent>,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.lastDocumentsSent = this.getLastDocumentVersion(this.data);
    this.emails = this.lastDocumentsSent.to;

    this.budgetsSent = [...this.lastDocumentsSent.budgets];

    this.reportsSent = [...this.lastDocumentsSent.reports];

    this.quotationsSent = [...this.lastDocumentsSent.quotations];

    this.form = this.fb.group({
      subject: [
        this.lastDocumentsSent.subject ? this.lastDocumentsSent.subject : '',
        Validators.required,
      ],
      body: [
        this.lastDocumentsSent.body ? this.lastDocumentsSent.body : '',
        Validators.required,
      ],
      observations: this.lastDocumentsSent.observations
        ? this.lastDocumentsSent.observations
        : '',
    });

    this.subscriptions.add(
      this.breakpoint
        .observe([Breakpoints.HandsetPortrait])
        .subscribe((res) => {
          if (res.matches) {
            this.isMobile = true;
          } else {
            this.isMobile = false;
          }
        })
    );

    this.subscriptions.add(
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
        })
    );
  }

  checkIfHaveDocuments(data: Budget): boolean {
    if (!this.data.documentVersions) return false;

    return !!data.documentVersions.length;
  }

  getLastDocumentVersion(data: Budget): DocumentVersion {
    return { ...data.documentVersions[data.versionCount - 1] };
  }

  getDownloadFile(path: string): Observable<any> {
    const ref = this.storage.ref(path);

    return ref.getDownloadURL();
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

  public deleteFile(kind: string, index: number): void {
    if (!kind || index < 0) return;

    switch (kind) {
      case 'budget':
        this.budgetsSent.splice(index, 1);
        this.budgetEdited = true;
        break;

      case 'report':
        this.reportsSent.splice(index, 1);
        this.reportEdited = true;
        break;

      case 'quotation':
        this.quotationsSent.splice(index, 1);
        this.quotationEdited = true;
        break;

      default:
        this.snackbar.open('Error en tipo de archivo', 'Aceptar', {
          duration: 6000,
        });
        break;
    }
  }

  public send(): void {
    // check if there is changes or new files
    if (this.generateNewVersion()) {
      // increase version with new files
      if (this.budgetFilesList.length === 0 && this.budgetsSent.length === 0)
        return;

      // first, initialize the variables for document uploads
      this.loading.next(true);
      const now = Date.now();
      let counter = 0;
      const totalFiles =
        this.budgetFilesList.length +
        this.reportFilesList.length +
        this.quotationFilesList.length;
      const currentVersionCount = this.data.versionCount + 1;
      // for every file in budgetFilesList, we will push a path reference to a budgetPathReferences
      let budgetFiles: Array<{ name: string; url: string }> = [];

      this.budgetFilesList.forEach((file) => {
        const filePath = `budgets/${this.data.id}/v${currentVersionCount}/budgets/${now}_${file.name}`;
        const task = this.storage.upload(filePath, file);

        this.fileSubscriptions.add(
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                this.storage
                  .ref(filePath)
                  .getDownloadURL()
                  .pipe(take(1))
                  .subscribe((url) => {
                    if (url) {
                      budgetFiles.push({
                        name: file.name,
                        url: url,
                      });

                      this.fileUploadCount.next(true);
                    }
                  });
              })
            )
            .subscribe()
        );
      });

      // for every file in reportFilesList, we will push  a path reference to reportPathReferences
      let reportFiles: Array<{ name: string; url: string }> = [];

      this.reportFilesList.forEach((file) => {
        const filePath = `budgets/${this.data.id}/v${currentVersionCount}/reports/${now}_${file.name}`;
        const task = this.storage.upload(filePath, file);

        this.fileSubscriptions.add(
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                this.storage
                  .ref(filePath)
                  .getDownloadURL()
                  .pipe(take(1))
                  .subscribe((url) => {
                    if (url) {
                      reportFiles.push({
                        name: file.name,
                        url: url,
                      });

                      this.fileUploadCount.next(true);
                    }
                  });
              })
            )
            .subscribe()
        );
      });

      // for every file in reportFilesList, we will push  a path reference to reportPathReferences
      let quotationFiles: Array<{ name: string; url: string }> = [];

      this.quotationFilesList.forEach((file) => {
        const filePath = `budgets/${this.data.id}/v${currentVersionCount}/quotations/${now}_${file.name}`;
        const task = this.storage.upload(filePath, file);

        this.fileSubscriptions.add(
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                this.storage
                  .ref(filePath)
                  .getDownloadURL()
                  .pipe(take(1))
                  .subscribe((url) => {
                    if (url) {
                      quotationFiles.push({
                        name: file.name,
                        url: url,
                      });

                      this.fileUploadCount.next(true);
                    }
                  });
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
              this.authService.user$.pipe(take(1)).subscribe((user) => {
                const batch = firebase.default.firestore().batch();
                const budgetRef = firebase.default
                  .firestore()
                  .doc(`db/ferreyros/budgets/${this.data.id}`);

                const emailData = {
                  version: currentVersionCount,
                  budgets: [...this.budgetsSent, ...budgetFiles],
                  reports: [...this.reportsSent, ...reportFiles],
                  quotations: [...this.quotationsSent, ...quotationFiles],
                  subject: this.form.value['subject'],
                  body: this.form.value['body'],
                  observations: this.form.value['observations'],
                  to: this.emails,
                };

                const data = {
                  versionCount: currentVersionCount,
                  documentVersions:
                    firebase.default.firestore.FieldValue.arrayUnion(emailData),
                  fechaUltimoEnvioPPTO: new Date(),
                  lastSendBy: user,
                };

                batch.update(budgetRef, data);

                batch
                  .commit()
                  .then(() => {
                    this.snackbar.open(
                      '✅ PTTO. enviado con éxito',
                      'Aceptar',
                      {
                        duration: 6000,
                      }
                    );
                    this.fileSubscriptions.unsubscribe();
                    this.loading.next(false);
                    this.dialogRef.close(true);
                    // Send email
                    this._budgetService.sendBudgetEmail({
                      id: this.data.id,
                      type: 'budget',
                      budgetFiles: budgetFiles.map((file) => file.url),
                      reportFiles: reportFiles.map((file) => file.url),
                      quotationFiles: quotationFiles.map((file) => file.url),
                      subject: this.form.value['subject'],
                      body: this.form.value['body'],
                      observations: this.form.value['observations'],
                      emailList: this.emails,
                      workOrder: this.data.ioMain,
                      workshop: this.data.taller,
                    });
                  })
                  .catch((err) => {
                    this.snackbar.open(
                      '🚨 Hubo un error guardando los archivos. Por favor, vuelva a intentarlo',
                      'Aceptar',
                      {
                        duration: 6000,
                      }
                    );
                  });
              });
            }
          } catch (error) {
            console.log(error);
          }
        })
      );
    } else {
      // just re-send the budget
      const emailData = {
        version: this.data.versionCount,
        budgets: this.budgetsSent,
        reports: this.reportsSent,
        quotations: this.quotationsSent,
        subject: this.form.value['subject'],
        body: this.form.value['body'],
        observations: this.form.value['observations'],
        to: this.emails,
      };

      this.snackbar.open('✅ PTTO. enviado con éxito', 'Aceptar', {
        duration: 6000,
      });
      this.fileSubscriptions.unsubscribe();
      this.loading.next(false);
      this.dialogRef.close(true);

      // Send email
      this._budgetService.sendBudgetEmail({
        id: this.data.id,
        type: 'budget',
        budgetFiles: this.budgetsSent.map((file) => file.url),
        reportFiles: this.reportsSent.map((file) => file.url),
        quotationFiles: this.quotationsSent.map((file) => file.url),
        subject: this.form.value['subject'],
        body: this.form.value['body'],
        observations: this.form.value['observations'],
        emailList: this.emails,
        workOrder: this.data.ioMain,
        workshop: this.data.taller,
      });
    }
  }

  private generateNewVersion(): boolean {
    // first, check if  there is any edition
    const editions =
      this.budgetEdited || this.reportEdited || this.quotationEdited;
    // second, check if there is any new file
    const newFiles =
      !!this.budgetFilesList.length ||
      !!this.reportFilesList.length ||
      !!this.quotationFilesList.length;

    return editions || newFiles;
  }

  private sendBudgetToEndpoint(data: any): void {
    console.log(data);
  }
}
