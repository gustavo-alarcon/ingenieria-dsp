import { BudgetsBroadcastList } from './../../../../../../models/budgets.model';
import { BudgetsService } from 'src/app/main/services/budgets.service';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  IterableDiffers,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { BehaviorSubject, combineLatest, from, Observable, of, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

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
  downloadURL: Observable<string>;

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

  public emailsValidation: boolean = false;

  // Form
  form: FormGroup;

  cantidadDeArchivos: number = 0;
  arrayObservablesArchivos: Array<
    Observable<firebase.default.storage.UploadTaskSnapshot>
  > = [];

  constructor(
    private _budgetService: BudgetsService,
    private breakpoint: BreakpointObserver,
    private fb: FormBuilder,
    private storage: AngularFireStorage
  ) {}

  public ngOnInit(): void {
    this.form = this.fb.group({
      subject: ['', Validators.required],
      body: ['', Validators.required],
      observations: '',
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

    console.log(this.startUpload());
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

  startUpload() {
    // Calcular cantidad de archivos
    this.cantidadDeArchivos =
      this.budgetFilesList.length +
      this.reportFilesList.length +
      this.quotationFilesList.length;

    this.budgetFilesList.forEach((doc: any) => {
      const id = Math.random().toString(36).substring(2);
      const file = doc;
      const filePath = `/assets/PRESUPUESTO_${id}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // observe percentage changes
      this.percentage = task.percentageChanges();

      // get notified when the download URL is available

      this.arrayObservablesArchivos.push(
        task
          .snapshotChanges()
          .pipe(finalize(() => (this.downloadURL = fileRef.getDownloadURL())))
      );
    });

    this.reportFilesList.forEach((doc: any) => {
      console.log(doc);
      const id = Math.random().toString(36).substring(2);
      const file = doc;
      const filePath = `/assets/INFORME_${id}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // observe percentage changes
      this.percentage = task.percentageChanges();

      // get notified when the download URL is available

      this.arrayObservablesArchivos.push(
        task
          .snapshotChanges()
          .pipe(finalize(() => (this.downloadURL = fileRef.getDownloadURL())))
      );
    });

    this.quotationFilesList.forEach((doc: any) => {
      console.log(doc);
      const id = Math.random().toString(36).substring(2);
      const file = doc;
      const filePath = `/assets/COT_${id}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // observe percentage changes
      this.percentage = task.percentageChanges();

      // get notified when the download URL is available

      this.arrayObservablesArchivos.push(
        task
          .snapshotChanges()
          .pipe(finalize(() => (this.downloadURL = fileRef.getDownloadURL())))
      );

    });

    combineLatest(
      this.arrayObservablesArchivos
    ).pipe(
      // takeUntil(this.stopReading$),
      map(([list]) => {
        console.log(list);
      })
    ).subscribe()


  }
}
