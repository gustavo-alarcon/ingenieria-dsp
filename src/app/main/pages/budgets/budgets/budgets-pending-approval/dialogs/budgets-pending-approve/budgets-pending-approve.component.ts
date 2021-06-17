import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BudgetsService } from 'src/app/main/services/budgets.service';
import { MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { Budget } from '../../../../../../models/budgets.model';
import * as firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-budgets-pending-approve',
  templateUrl: './budgets-pending-approve.component.html',
  styleUrls: ['./budgets-pending-approve.component.scss']
})
export class BudgetsPendingApproveComponent implements OnInit {
  filesFormGroup: FormGroup;
  woMain: number = 0;
  woChild: number | null = null;

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loading.asObservable();

  constructor( private budgetsService: BudgetsService,
               @Inject (MAT_DIALOG_DATA) private data: Budget,
                private matSnackBar: MatSnackBar,
                private dialog: MatDialog)  { }

  ngOnInit(): void {
    this.woChild = this.data.woChild;
    this.woMain = this.data.woMain;
  }

  saveChanges( ): void {

    // console.log(this.data.statusPresupuesto);
    this.loading.next(true)
    this.budgetsService.updateBudgetStatus( this.data.id, {
      statusPresupuesto:'PPTO. APROBADO'
    }) .subscribe((batch: firebase.default.firestore.WriteBatch) => {
      batch.commit().then(()=>{
        this.loading.next(false);
      })
      this.matSnackBar.open(
        '✅ Archivo se ha aprobado de forma correcta!',
        'Aceptar',
        {
          duration: 6000,
        }
      );
      this.dialog.closeAll();
    })
   
    
    
    
   

  //  this.budgetsService.getBudgetsPendingApproval( this.data.id, {
  //    status
  //  })

  
       

    // console.log(this.firstCheckboxStamp);
    // console.log(currentCheckboxes);
  }

  }

