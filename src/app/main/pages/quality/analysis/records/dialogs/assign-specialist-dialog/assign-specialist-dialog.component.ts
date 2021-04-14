import { User } from './../../../../../../models/user-model';
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
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { QualityService } from 'src/app/main/services/quality.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quality, QualityBroadcastList } from 'src/app/main/models/quality.model';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatChipInputEvent } from '@angular/material/chips';
import { QualityListSpecialist } from '../../../../../../models/quality.model';
import { OnDestroy } from '@angular/core';
import { AuthService } from '../../../../../../../auth/services/auth.service';
import { EvaluationsUser } from 'src/app/main/models/evaluations.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-assign-specialist-dialog',
  templateUrl: './assign-specialist-dialog.component.html',
  styleUrls: ['./assign-specialist-dialog.component.scss'],
})
export class AssignSpecialistDialogComponent implements OnInit, OnDestroy {
  specialistForm: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  //Chip email
  emailArray: string[] = [];
  filteredBroadcast$: Observable<QualityBroadcastList[]>;
  broadcastControl = new FormControl();
  listBroadcast: string[] = [];

  state = 'process';

  // chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
 
  
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  // Autocomplete  
  selectedSpecialist = new BehaviorSubject<any>(null);
  selectedSpecialist$ = this.selectedSpecialist.asObservable();
  actualSpecialist: any = null;


  specialist$: Observable<any[]>;
  nameSpecialist = 'Técnico Especialista';

  user: User;
  emailUser;

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    public dialogRef: MatDialogRef<AssignSpecialistDialogComponent>,
    private qualityService: QualityService,
    private snackbar: MatSnackBar,
    public auth: AuthService,

  ) {
    this.subscription.add(
      this.auth.user$.subscribe((user) => {
        this.user = user;
        this.emailUser = this.user.email;
        this.emailArray.push(this.emailUser);

      })
    );

  }


  ngOnInit(): void {
    this.initForm();

    this.specialist$ = combineLatest(
      this.specialistForm.get('specialist').valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map(specialist => specialist.name ? specialist.name : specialist)
        ),
      this.qualityService.getAllQualityListSpecialist(this.nameSpecialist)
    ).pipe(map( ([formValue, specialists]) => {

      const filter = specialists.filter((specialist) => {
        return specialist.name.toLowerCase().includes(formValue.toLowerCase());
      });

      /* 
      let filter = specialists.filter(el => formValue ? el.name.toLowerCase().includes(formValue.toLowerCase()):'');
      return filter; 
      if (!(filter.length == 1 && filter[0] === formValue) && formValue.length) {
        this.specialistForm.get('specialist').setErrors({ invalid: true });
      }
      */
      return filter;
      }
     ));

     
    this.filteredBroadcast$ = this.qualityService.getAllBroadcastList().pipe(
      tap((res: QualityBroadcastList[]) => {
        return res;
      })
    );

    /* this.filteredBroadcast$ = combineLatest(
      this.broadcastControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map(broadcast => broadcast.name ? broadcast.name : broadcast)
        ),
        this.qualityService.getAllBroadcastList()
    ).pipe(map( ([formValue, broadcasts]) => {
      console.log('formValue : ', formValue)
      console.log('broadcasts : ', broadcasts)

      const filter = broadcasts.filter((broadcast) => {
        return broadcast.name.toLowerCase().includes(formValue.toLowerCase());
      });
      return filter;
      }
     )); */


  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.specialistForm = this.fb.group({
      specialist: [null, Validators.required],
    });

  }

  save(): void {
    try {
      if (this.specialistForm.valid  ) {
        const resp = this.qualityService.updateQualitySpecialist(
          this.data,
          this.specialistForm.get('specialist').value,
          this.emailArray,
          this.state
        );
        this.loading.next(true);
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {  
              batch
                .commit()
                .then(() => {
                  this.loading.next(false);
                  this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
                    duration: 6000,
                  });
                  this.dialogRef.close();
                })
                .catch((err) => {
                  this.loading.next(false);
                  this.snackbar.open('🚨 Hubo un error al crear!', 'Aceptar', {
                    duration: 6000,
                  });
                });
            }
          })
        );
      }

    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }

  removeEmail(email: string): void {
    const index = this.emailArray.indexOf(email);

    if (index >= 0) {
      this.emailArray.splice(index, 1);
    }
  }
  addBroadcast(event: MatChipInputEvent): void {
    const input = event.input;
    console.log('input :', input)
    const value = event.value;
    console.log('value :', value)

    // Add our fruit
    if ((value || '').trim()) {
      this.emailArray.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.broadcastControl.setValue(null);
  }
  selectedBroadcast(event: MatAutocompleteSelectedEvent): void {
    event.option.value.emailList.map((el) => {
       this.emailArray.push(el);
    });

    this.fruitInput.nativeElement.value = '';
    this.broadcastControl.setValue(null);
  }


  showEntrySpecialist(specialist: EvaluationsUser): string | null {
    return specialist ? specialist.name : null;
  }

  selectedEntrySpecialist(event: any): void {
    const emailSpecialist =  event.option.value.email;
    this.emailArray.push(emailSpecialist);

    this.selectedSpecialist.next(event.option.value);
    this.actualSpecialist = event.option.value;
  }
 /*  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  } */
}
