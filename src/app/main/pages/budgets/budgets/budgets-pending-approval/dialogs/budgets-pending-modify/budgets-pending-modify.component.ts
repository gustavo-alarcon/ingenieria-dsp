import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  Pipe,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ENTER, COMMA, SPACE, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  ModificationReasonEntry,
  RejectionReasonsEntry,
  Budget,
} from '../../../../../../models/budgets.model';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { combineLatest, observable, Observable, pipe } from 'rxjs';
import { BudgetsService } from '../../../../../../services/budgets.service';
import { User } from '../../../../../../models/user-model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { element } from 'protractor';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-budgets-pending-modify',
  templateUrl: './budgets-pending-modify.component.html',
  styleUrls: ['./budgets-pending-modify.component.scss'],
})
export class BudgetsPendingModifyComponent implements OnInit {
  selectable: boolean = true;
  removable: boolean = true;

  modificationReasonControl = new FormControl('');

  modificationReasonList: Observable<ModificationReasonEntry[]>;

  constructor(private budgetService: BudgetsService) {}

  ngOnInit(): void {

    this.modificationReasonList = combineLatest(
      this.budgetService.getAllReasonsForModificationEntries(),
      this.modificationReasonControl.valueChanges.pipe(
        startWith(''),
        // map((value) =>
        //   typeof value === 'string'
        //     ? value.toLowerCase()
        //     : value['name'].toLowerCase()
        // )
      )
    ).pipe(
      map(([list, search]) => {
        console.log(search);
        
        return list.filter((element) => element.name.toLowerCase().includes(search));
      })
    );

  }

  showModification(value: ModificationReasonEntry): string | null {
    return value ? value.name : null;
  }
}
