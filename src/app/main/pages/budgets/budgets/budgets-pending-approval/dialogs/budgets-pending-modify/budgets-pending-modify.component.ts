import { Component, OnInit, ViewChild, ElementRef, Inject, Pipe } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ENTER, COMMA, SPACE, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ModificationReasonEntry, RejectionReasonsEntry, Budget } from '../../../../../../models/budgets.model';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { observable, Observable, pipe } from 'rxjs';
import { BudgetsService } from '../../../../../../services/budgets.service';
import { User } from '../../../../../../models/user-model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { element } from 'protractor';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-budgets-pending-modify',
  templateUrl: './budgets-pending-modify.component.html',
  styleUrls: ['./budgets-pending-modify.component.scss']
})
export class BudgetsPendingModifyComponent implements OnInit {
  public selectable: boolean = true;
  public removable: boolean = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA, SPACE, TAB];
  public reasonCtrl: FormControl = new FormControl();

  public filteredReason: Observable<string[]>;

   // Broadcast lists
   
   public modificationReasonList: ModificationReasonEntry[] = [];
   
   @ViewChild('reasonInput') reasonInput: ElementRef<HTMLInputElement>;
   @ViewChild('auto') matAutocomplete: MatAutocomplete;

  
  public reason: string[] = [];

  form: FormGroup;

  constructor( private budgetService: BudgetsService) { }

  ngOnInit(): void {
    
    // this.budgetService
    //     .getAllReasonsForModificationEntries()
    //     .subscribe(( modificationReasonList: RejectionReasonsEntry[]) =>{
    //          modificationReasonList.forEach( element => {
    //            this.modificationReasonList.push(element);
      
    //           this.filteredReason = this.reasonCtrl.valueChanges
    //               .pipe(
    //                  startWith(' '),
    //                  map( value => typeof value === 'string' ? value: value.name),
    //                  map( name => name ? this._filter(name) : this.modificationReasonList.slice() )
    //               )
                    
    //          })
    //     })
        
  }

  private _filter(value: string): RejectionReasonsEntry[] {
    const filterValue = value.toLowerCase();

    return this.modificationReasonList.filter( reason => reason.name.toLowerCase().indexOf(filterValue))
  }


  public removeReason(reason: string): void {
    const index = this.reason.indexOf(reason);

    if (index >= 0) {
      this.reason.splice(index, 1);
    }
  }

  public addReason (event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    
    // Add our reason
    if (value) {
      this.reason.push(value);
    }
    
    if (event.input) {
      event.input.value = '';
    }
    
    this.reasonCtrl.setValue(null);

  }

  public selectReason (event: MatAutocompleteSelectedEvent): void {
    const broadcastList: ModificationReasonEntry = this.modificationReasonList.filter(
      (list) => list.name === event.option.viewValue
    )[0];
    this.reason.push(broadcastList.name)
   

    // check this
    this.reasonInput.nativeElement.value = '';
    this.reasonCtrl.setValue(null);
  }

}
