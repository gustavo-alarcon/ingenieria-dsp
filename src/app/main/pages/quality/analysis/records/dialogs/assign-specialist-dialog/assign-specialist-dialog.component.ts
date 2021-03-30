import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { QualityService } from 'src/app/main/services/quality.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quality } from 'src/app/main/models/quality.model';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import {
  map,
  startWith,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatChipInputEvent } from '@angular/material/chips';
import { QualityListSpecialist } from '../../../../../../models/quality.model';

@Component({
  selector: 'app-assign-specialist-dialog',
  templateUrl: './assign-specialist-dialog.component.html',
  styleUrls: ['./assign-specialist-dialog.component.scss'],
})
export class AssignSpecialistDialogComponent implements OnInit {
  specialistForm: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  // chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  // Autocomplete  
  selectedSpecialist = new BehaviorSubject<any>(null);
  selectedSpecialist$ = this.selectedSpecialist.asObservable();
  actualSpecialist: any = null;


  specialist$: Observable<any[]>;
  nameSpecialist = 'Técnico Especialista';


  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    public dialogRef: MatDialogRef<AssignSpecialistDialogComponent>,
    private qualityService: QualityService,
    private snackbar: MatSnackBar
  ) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
    );
  }

  ngOnInit(): void {
    this.initForm();

    this.specialist$ = combineLatest(
      this.specialistForm.get('specialist').valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map(name => name ? name : '')),
      this.qualityService.getAllQualityListSpecialist(this.nameSpecialist)
    ).pipe(map( ([formValue, specialists]) => {
      console.log('formValue : ', formValue)
      console.log('specialists : ', specialists)
      const filter = specialists.filter((specialist) => {
        return specialist.name.toLowerCase().includes(formValue.toLowerCase());
      });
      if (!(filter.length == 1 && filter[0] === formValue) && formValue.length) {
        this.specialistForm.get('specialist').setErrors({ invalid: true });
      }
      return filter;
      }
     ));
   
  }
  initForm(): void {
    this.specialistForm = this.fb.group({
      specialist: [null, Validators.required],
    });

  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }

  save(): void {}

  showEntrySpecialist(specialist: any): string | null {
    console.log('product : ', specialist)
    return specialist.name ? specialist.name : null;
  }

  selectedEntrySpecialist(event: any): void {
    console.log('event : ', event.option.value)
    this.selectedSpecialist.next(event.option.value);
    this.actualSpecialist = event.option.value;
    console.log(' this.actualSpecialist : ',  this.actualSpecialist)
  }
}
