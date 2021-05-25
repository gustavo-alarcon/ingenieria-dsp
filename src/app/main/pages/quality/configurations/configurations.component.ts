import { MyErrorStateMatcher } from './../../evaluations/evaluations-settings/evaluations-settings.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subscription, Observable, combineLatest } from 'rxjs';
import { tap, startWith, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/main/models/user-model';
import { QualityService } from 'src/app/main/services/quality.service';
import {
  QualityListSpecialist,
  QualityBroadcastList,
} from '../../../models/quality.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteBroadcastDialogComponent } from './dialogs/delete-broadcast-dialog/delete-broadcast-dialog.component';
import { AddBroadcastDialogComponent } from './dialogs/add-broadcast-dialog/add-broadcast-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss'],
})
export class ConfigurationsComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  panelOpenState = false;

  broadcastFormArray = new FormArray([]);
  broadcastListArray: QualityBroadcastList[] = [];

  listSpecialistControl = new FormControl(null, [Validators.required]);
  listSpecialistArray = [];

  listResponsibleAreasControl = new FormControl(null, [Validators.required]);
  listResponsibleAreasArray = [];

  matcher = new MyErrorStateMatcher();
  listProblemTypeArray = [];
  listNameBahiaArray = [];

  broadcast$: Observable<QualityBroadcastList[]>;

  private subscription = new Subscription();
  user: User;

  isMobile = false;
  containerStyle: any;
  step = 0;

  areaForm: FormGroup;

  //Autocomplete
  entrySpecialistControl: FormControl;
  selectedSpecialist = new BehaviorSubject<any>(null);
  selectedSpecialist$ = this.selectedSpecialist.asObservable();
  actualSpecialist: any = null;
  entrySpecialist$: Observable<User[]>;

  scanValidation$: Observable<any>;

  historyMobilDataSource = new MatTableDataSource<any[]>();
  historyMobilDisplayedColumns: string[] = [
    'name',
    'email',
    'actions'
  ];

  @ViewChild('historyMobilPaginator', { static: false }) set content1(
    paginator: MatPaginator
  ) {
    this.historyMobilDataSource.paginator = paginator;
  }

  areaResponsable$: Observable<any[]>;



  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private snackbar: MatSnackBar,
    private qualityService: QualityService,
    private breakpoint: BreakpointObserver,
    public dialog: MatDialog,

  ) {}

  ngOnInit(): void {
    this.entrySpecialistControl = this.fb.control('', Validators.required);
    this.initForm();
    this.subscription.add(
      this.breakpoint
        .observe([Breakpoints.HandsetPortrait])
        .subscribe((res) => {
          if (res.matches) {
            this.isMobile = true;
            //this.setHandsetContainer();
          } else {
            this.isMobile = false;
            //this.setDesktopContainer();
          }
        })
    );

    this.broadcast$ = this.qualityService.getAllBroadcastList().pipe(
      tap((res: QualityBroadcastList[]) => {
        if (res) {
          this.broadcastListArray = res;
        }
        res.map((el) => {
          this.broadcastFormArray.push(
            new FormControl(null, Validators.required)
          );
        });
      })
    );

    this.loading.next(true);
    this.subscription.add(
      this.authService.user$.subscribe((user) => {
        this.user = user;
      })
    );

    /* this.subscription.add(
      this.qualityService.getAllQualityListResponsibleAreas()
        .subscribe((resp) => {
          if (resp) {
            this.historyMobilDataSource.data = resp;
          } else {
            this.historyMobilDataSource.data = [];
          }
        })
    ); */

    this.areaResponsable$ = this.qualityService.getAllQualityListResponsibleAreas().pipe(
      tap((resp) => {
          if (resp) {
            this.historyMobilDataSource.data = resp;
          } else {
            this.historyMobilDataSource.data = [];
          }
        }
      )
      );


    this.entrySpecialist$ = combineLatest(
      this.qualityService.getAllUser(),
      this.entrySpecialistControl.valueChanges
        .pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged(),
          map(specialist => specialist.name ? specialist.name : specialist)
        )
    ).pipe(
      map(([specialists, entrySpecialist]) => {
          return specialists.filter(specialist => {
          return specialist.name.toLowerCase().includes(entrySpecialist.toLowerCase());
        });
      })
    );


    this.loading.next(false);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  initForm(){
    this.areaForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)
        ]],
    });
  }

  setStep(index: number): void {
    this.step = index;
  }

  addBroadcast(): void{
    this.dialog.open(AddBroadcastDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });

    this.broadcastFormArray.push(new FormControl(null, Validators.required));
  }

  addListDiffusion(broadcast: QualityBroadcastList, index: number): void {
    try {
      const name = broadcast.name;
      const newBroadcast = this.broadcastFormArray.controls[index].value.trim().toLowerCase();

      if ( broadcast.id){
        const entryId = broadcast.id;

        const resp = this.qualityService.updateBrodcastList(entryId, newBroadcast, this.user);
        //this.loading.next(true);
        this.subscription.add(resp.subscribe(
          batch => {
            if (batch) {
              batch.commit()
                .then(() => {
                  //this.loading.next(false);
                  this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
                    duration: 6000
                  });
                  this.broadcastFormArray.removeAt(index);

                })
                .catch(err => {
                  //this.loading.next(false);
                  this.snackbar.open('🚨 Hubo un error al actualizar  !', 'Aceptar', {
                    duration: 6000
                  });
                });
            }
          }
        ));
      }

    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }

  }
  async deleteListBroadcast(
    broadcast: QualityBroadcastList,
    index: number
  ): Promise<void> {
    if (broadcast.id != null) {
      this.loading.next(true);
      this.dialog.open(DeleteBroadcastDialogComponent, {
        maxWidth: 500,
        width: '90vw',
        data: broadcast,
      });
      this.loading.next(false);
    } else {
      this.broadcastListArray.splice(index, 1);
    }
  }

  updateBrocastListEmail(
    broadcast: QualityBroadcastList,
    broadcastList: string
  ): void {
    try {
      const resp = this.qualityService.updateBrodcastEmailList(
        broadcast.id,
        broadcastList
      );
      //this.loading.next(true);
      this.subscription.add(
        resp.subscribe((batch) => {
          if (batch) {
            batch
              .commit()
              .then(() => {
                // this.loading.next(false);
                this.snackbar.open('✅ Se elimino correctamente!', 'Aceptar', {
                  duration: 6000,
                });
              })
              .catch((err) => {
                // this.loading.next(false);
                this.snackbar.open('🚨 Hubo un error al crear!', 'Aceptar', {
                  duration: 6000,
                });
              });
          }
        })
      );
    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }

  addListSpecialist(): void {
    /* if (this.listSpecialistControl.valid) {
      const objAux: QualityListSpecialist = {
        id: null,
        name: this.listSpecialistControl.value.trim(),
        createdAt: null,
        createdBy: null,
      };
      const valueIsEquals = (currentValue) =>
        currentValue.name !== objAux.name;
      if (this.listSpecialistArray.every(valueIsEquals)) {
        this.listSpecialistArray.push(objAux);
      }
      this.listSpecialistControl.reset();
    } */
  }
  async deleteListSpecialist(index: number): Promise<void> {
    if (this.listSpecialistArray[index].id) {
      this.loading.next(true);
      await this.qualityService.deleteQualityListSpecialist(
        this.listSpecialistArray[index].id
      );
      this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
        duration: 6000,
      });
      this.loading.next(false);
    }

    this.listSpecialistArray.splice(index, 1);
    this.loading.next(false);
  }

  saveListSpecialist(): void {
    try {
      const resp = this.qualityService.addQualityListSpecialist(
        this.listSpecialistArray,
        this.user
      );
      //this.loading.next(true);
      this.subscription.add(
        resp.subscribe((batch) => {
          if (batch) {
            batch
              .commit()
              .then(() => {
                // this.loading.next(false);
                this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
                  duration: 6000,
                });
              })
              .catch((err) => {
                // this.loading.next(false);
                this.snackbar.open('🚨 Hubo un error al crear!', 'Aceptar', {
                  duration: 6000,
                });
              });
          }
        })
      );
    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }

  deleteListResponsibleArea(item: any){
    const index = item.id;
    try {
        const resp = this.qualityService.deleteQualityListResponsibleAreas(
        index
        );
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {
              batch
                .commit()
                .then(() => {
                  this.snackbar.open('✅ Se borrado correctamente!', 'Aceptar', {
                    duration: 6000,
                  });
                })
                .catch((err) => {
                  this.snackbar.open('🚨 Hubo un error al crear!', 'Aceptar', {
                    duration: 6000,
                  });
                });
            }
          })
        );

    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }

  saveResponsibleArea(){
    try {

      if (this.areaForm.valid) {
        const resp = this.qualityService.addQualityListResponsibleAreas(
          this.areaForm.value,
          this.user
        );
        //this.loading.next(true);
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {
              batch
                .commit()
                .then(() => {
                  //this.loading.next(false);
                  this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
                    duration: 6000,
                  });
                  this.areaForm.reset();
                  
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
  showEntrySpecialist(specialist: QualityListSpecialist): string | null {
   console.log('showEntrySpecialist : ', specialist)
   return specialist.name ? specialist.name : null;
  }

  selectedEntrySpecialist(event: any): void {
    console.log('selectedEntrySpecialist : ', event.option.value)
    this.selectedSpecialist.next(event.option.value);
    this.actualSpecialist = event.option.value;

    if (this.entrySpecialistControl.valid) {
      const objAux: QualityListSpecialist = {
        id: null,
        name: event.option.value.name,
        email: event.option.value.email,
        role: event.option.value.role,
        picture: event.option.value.picture,
        createdAt: null,
        createdBy: null,
      };
      const valueIsEquals = (currentValue) =>
        currentValue.name !== objAux.name;
      if (this.listSpecialistArray.every(valueIsEquals)) {
        this.listSpecialistArray.push(objAux);
      }
      this.entrySpecialistControl.reset();
    }
    console.log('listSpecialistArray : ', this.listSpecialistArray)
  }

  setHandsetContainer(): void {
    this.containerStyle = {
      margin: '30px 24px 30px 24px',
    };
  }

  setDesktopContainer(): void {
    this.containerStyle = {
      margin: '30px 80px 30px 80px',
    };
  }
}
