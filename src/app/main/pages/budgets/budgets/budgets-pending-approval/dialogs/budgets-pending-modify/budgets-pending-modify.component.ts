import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModificationReasonEntry, Budget } from '../../../../../../models/budgets.model';
import { combineLatest, Observable, pipe, BehaviorSubject } from 'rxjs';
import { BudgetsService } from '../../../../../../services/budgets.service';
import { filter, map, startWith } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { element } from 'protractor';

@Component({
  selector: 'app-budgets-pending-modify',
  templateUrl: './budgets-pending-modify.component.html',
  styleUrls: ['./budgets-pending-modify.component.scss'],
})
export class BudgetsPendingModifyComponent implements OnInit {

  additionalFiles: FormGroup;

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

  constructor(private budgetService: BudgetsService,
              private formBuilder  : FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: Budget,
              private matSnackBar: MatSnackBar,
              private dialog: MatDialog) {}

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
        // console.log(search);
        
        return list.filter((element) => element.name.toLowerCase().includes(search));
      })
    );

    this.additionalFiles = new FormGroup ({
      additionals: this.formBuilder.array([])
    });

    this.firstModificationDocsStamp = this.additionalFiles.value.modify;

    this.firstAdditionalDocsStamp = this.additionalFiles.value.additionals;

    // if(this.data.additionals){
    //   this.data.additionals.forEach((doc:any) => {
    //     this.additionalForms.push(
    //       this.newAdditionalDocFormGroup(doc.type, doc.typeObs)
    //     );
    //   }) 
    // }

  
    

  }

  saveChanges(): void {
    
    const additinalDocs = this.additionalFiles.value.additionals;
    
    if(this.firstModificationDocsStamp !== additinalDocs){

      this.loading.next(true);
      this.budgetService
          .updateModifyReason( this.data.id , this.modificationReasonControl.value)
          .subscribe((batch: firebase.default.firestore.WriteBatch) =>{
            batch.commit().then(() =>{
              this.loading.next(false);
            })
          })
           
    }
    
    if(this.firstAdditionalDocsStamp !== additinalDocs ){
     // Update additionals
     this.loading.next(true);
     this.budgetService
         .updateBudgetFields( this.data.id, {
          additionals: additinalDocs,
         })
         .subscribe((batch: firebase.default.firestore.WriteBatch) => {
           batch.commit().then(() => {
             this.loading.next(false);
             this.matSnackBar.open(
              ' ✅ Archivo se modifico de forma correcta',
              'Aceptar',
              {
                duration:6000,
              }
             );
             this.dialog.closeAll();
           })
         });
    }

    
  }

  // private newAdditionalDocFormGroup(type: string, typeObs?: string): FormGroup {
  //   if (!typeObs) {
  //     typeObs = '';
  //   }

  //   return this.formBuilder.group({
  //     type: [`${type}`, Validators.required],
  //     typeObs: [`${typeObs}`],
  //   });
  // }

  showModification(value: ModificationReasonEntry): string | null {
    return value ? value.name : null;
  }

  get additionalForms(): FormArray {
    return this.additionalFiles.get('additionals') as FormArray;
  }


  addAdditional(): void {
    const form = this.formBuilder.group({
      type: ['parallel', Validators.required],
      typeObs: [''],
    });

    this.additionalForms.push(form);
  }

  deleteAdditional(i: number) {
    this.additionalForms.removeAt(i);
  }

}
