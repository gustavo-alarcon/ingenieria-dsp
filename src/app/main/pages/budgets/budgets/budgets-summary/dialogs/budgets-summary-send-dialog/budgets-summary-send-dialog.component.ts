import { BudgetsBroadcastList,Budget } from './../../../../../../models/budgets.model';
import { BudgetsService } from 'src/app/main/services/budgets.service';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  Inject,
  IterableDiffers,
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
import { BehaviorSubject, combineLatest, from, Observable, of, Subscription } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadTaskComponent } from '../../../../../../../shared/components/upload-task/upload-task.component';
// import { Budget, documentVersion } from '../../../../../../models/budgets.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { version } from 'xlsx/types';
import { element } from 'protractor';

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

  doc$:Observable<string>;

  arrayDownload : string[] = [];

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

  constructor(
    private _budgetService: BudgetsService,
    private breakpoint: BreakpointObserver,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Budget,
    private storage: AngularFireStorage,
    
  ) {
    this.data.documentVersion = { 
      version : 0,
      budgets : [],
      reports : [],
      quotations : []
    }
    
  }

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

  // saveUrl (){
  
  //   this.data.budgetUrl.forEach( (url:File) =>{
  //     this.urls.push(url)
  //   })
  // }
  
   startUpload() {
    
    // Calcular cantidad de archivos
    // this.cantidadDeArchivos =
    //   this.budgetFilesList.length +
    //   this.reportFilesList.length +
    //   this.quotationFilesList.length;

    this.budgetFilesList.forEach( (doc: any) => {
      this.doc$ = of(doc);

      this.doc$.subscribe(data => console.log(data))
      const id = Math.random().toString(36).substring(2);
      const file = this.doc$.subscribe();
      const filePath = `/budgets/v${this.data.versionCount}/${id}/PRESUPUESTO_${id}`;
      const fileRef = this.storage.ref(filePath);
      const task =  this.storage.upload(filePath, file);

      // observe percentage changes
      this.percentage = task.percentageChanges();
      
      // fileRef.getDownloadURL().subscribe( async (url) => {
      //     const urlPath = await url;
      //     this.data.documentVersion.budgets.push(
      //     urlPath
      //   )
      // })
      // get notified when the download URL is available

     
      this.arrayObservablesArchivos.push(
        task
          .snapshotChanges()
          .pipe(finalize(() => (this.downloadURL1 = fileRef.getDownloadURL())))
         
      );
       
      setTimeout(() => {

      

         this.downloadURL1.subscribe( budgetValor => {
             
            this.data.documentVersion.version = this.data.versionCount;
             this.data.documentVersion.budgets.push(budgetValor)
          })
      }, 1500);
     


      
      
     
    });
  
    
    this.reportFilesList.forEach((doc: any) => {
      const id = Math.random().toString(36).substring(2);
      const file = doc;
      const filePath = `/budgets/v${this.data.versionCount}/${id}/INFORME_${id}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // observe percentage changes
      this.percentage = task.percentageChanges();
      
      // get notified when the download URL is available
      // fileRef.getDownloadURL().subscribe( url => {
      //   this.data.documentVersion.reports.push(
      //     url
      //   )
      // })

      this.arrayObservablesArchivos.push(
        task
          .snapshotChanges()
          .pipe(finalize(() => (this.downloadURL2 = fileRef.getDownloadURL())))
      );

           
      setTimeout(() => {

        //  console.log(this.downloadURL2)

        this.downloadURL2.subscribe( valor1 => {
            
           this.data.documentVersion.version = this.data.versionCount;
            this.data.documentVersion.reports.push(valor1)
         })
     }, 1500);
      

    });

    this.quotationFilesList.forEach((doc: any) => {
      const id = Math.random().toString(36).substring(2);
      const file = doc;
      const filePath = `/budgets/v${this.data.versionCount}/${id}/COT_${id}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      

      // observe percentage changes
      this.percentage = task.percentageChanges();

      // get notified when the download URL is available
      // fileRef.getDownloadURL().subscribe( url => {
      //   this.data.documentVersion.quotations.push(
      //     url
      //   )
      // })
      this.arrayObservablesArchivos.push(
        task
          .snapshotChanges()
          .pipe(finalize(() => (this.downloadURL3 = fileRef.getDownloadURL())))
      );

           
      setTimeout(() => {

      

        this.downloadURL3.subscribe( valor2 => {
            
           this.data.documentVersion.version = this.data.versionCount --;
            this.data.documentVersion.quotations.push(valor2)
         })
     }, 1500);
      
     

      
    });
 
    this.loading.next(false);
  
    combineLatest(
     
      this.arrayObservablesArchivos
    ).pipe(
      // takeUntil(this.stopReading$),
      map(([list], index) => {
    
        this.loading.next(true);
        if( list.state === 'success' ){
          this.loading.next(false);
          
          // this.arrayObservablesArchivos[0].subscribe( valor => {
          //   console.log(valor);
          // })
          
          setTimeout(() => {

            console.log(this.data.documentVersion);
            // this.downloadURL1.forEach( docUrl => {
            //     console.log(docUrl);
            // })
          
          // this.downloadURL1.subscribe( valor => {

          //   console.log(valor);
             
          //   // this.data.documentVersion.version = this.data.versionCount;
          //   //  this.data.documentVersion.budgets.push(valor)
          // })
         
          //  this.data.documentVersion.reports.push(
          //   this.downloadURL2
          // )

          // console.log(this.data.documentVersion)
         
          //   this.downloadURL1.forEach( v =>{
          //     console.log(v);
          //   })
          //   console.log(this.data.documentVersion.budgets)

          }, 1500)
          
        //  this.data.budgetsUrl.push(
        //    this.downloadURL1
        //  )
    
          this.data.versionCount ++
          
        }
      })
     

    ).subscribe()
   
   
  }
   

}
