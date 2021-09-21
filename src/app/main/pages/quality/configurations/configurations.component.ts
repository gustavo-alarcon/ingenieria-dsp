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
  WorkshopList,
  ComponentList,
  MiningOperation,
} from '../../../models/quality.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteBroadcastDialogComponent } from './dialogs/delete-broadcast-dialog/delete-broadcast-dialog.component';
import { AddBroadcastDialogComponent } from './dialogs/add-broadcast-dialog/add-broadcast-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { WorkshopModel } from 'src/app/main/models/workshop.model';
import { DeleteWorkshopDialogComponent } from './dialogs/delete-workshop-dialog/delete-workshop-dialog.component';
import { EditDialogComponent } from '../analysis/results/dialogs/edit-dialog/edit-dialog.component';
import { EditWorkshopDialogComponent } from './dialogs/edit-workshop-dialog/edit-workshop-dialog.component';
import { workshopForm } from '../../../models/workshop.model';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss'],
})
export class ConfigurationsComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading1 = new BehaviorSubject<boolean>(false);
  loading2 = new BehaviorSubject<boolean>(false);
  loading3 = new BehaviorSubject<boolean>(false);
  loading4 = new BehaviorSubject<boolean>(false);

  loading$ = this.loading.asObservable();
  loading1$ = this.loading1.asObservable();
  loading2$ = this.loading2.asObservable();
  loading3$ = this.loading3.asObservable();
  loading4$ = this.loading4.asObservable();

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
  workshopForm: FormGroup;

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

  workshopDataSource = new MatTableDataSource<any[]>();
  workshopDisplayedColumns: string[] = [
    'No',
    'workshopNameProcess',
    'actions'
  ];

  @ViewChild('workshopPaginator', { static: false }) set content2(
    paginator: MatPaginator
  ) {
    this.workshopDataSource.paginator = paginator;
  }

  areaResponsable$: Observable<any[]>;
  workshopProcess$: Observable<any[]>;
  workshopProcessArray: string[] = [];


  public entryWorkshopControl: FormControl = new FormControl(
    null,
    Validators.required
  );
  public entryComponentInternalControl: FormControl = new FormControl(
    null,
    Validators.required
  );
  public entryComponentExternalControl: FormControl = new FormControl(
    null,
    Validators.required
  );
  public entryMiningOperationControl: FormControl = new FormControl(
    null,
    Validators.required
  );

  public listWorkshopArray: Array<WorkshopList> = [];
  public listComponentInternalArray: Array<ComponentList> = [];
  public listComponentExternalArray: Array<ComponentList> = [];
  public listMiningOperationArray: Array<MiningOperation> = [];


  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private snackbar: MatSnackBar,
    private qualityService: QualityService,
    private breakpoint: BreakpointObserver,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {

    this.subscription.add(
      this.qualityService.getAllWorkshopList()
        .subscribe((resp) => {
          if (resp) {
            this.listWorkshopArray = resp;
          } else {
            this.listWorkshopArray = [];
          }
        })
    );

    this.subscription.add(
      this.qualityService.getAllComponentsListInternal()
        .subscribe((resp) => {
          if (resp) {
            this.listComponentInternalArray = resp;
          } else {
            this.listComponentInternalArray = [];
          }
        })
    );

    this.subscription.add(
      this.qualityService.getAllComponentsListExternal()
        .subscribe((resp) => {
          if (resp) {
            this.listComponentExternalArray = resp;
          } else {
            this.listComponentExternalArray = [];
          }
        })
    );

    this.subscription.add(
      this.qualityService.getAllMiningOperationList()
        .subscribe((resp) => {
          if (resp) {
            this.listMiningOperationArray = resp;
          } else {
            this.listMiningOperationArray = [];
          }
        })
    );

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


    this.workshopProcess$ = this.qualityService.getAllQualityInternalWorkshop().pipe(
      tap((resp) => {
        if (resp) {
          this.workshopDataSource.data = resp;
        } else {
          this.workshopDataSource.data = [];
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

  initForm() {
    this.areaForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)
      ]],
    });

    this.workshopForm = this.fb.group({
      workshopName: ['', [Validators.required]],
      workshopProcess: ['']
    })
  }

  setStep(index: number): void {
    this.step = index;
  }

  addBroadcast(): void {
    this.dialog.open(AddBroadcastDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });

    this.broadcastFormArray.push(new FormControl(null, Validators.required));
  }

  addWorkshopProcess(): void {
    if (this.workshopForm.get('workshopName').invalid && this.broadcastFormArray.length === 0) {
      this.workshopForm.markAllAsTouched();
      return;
    }
    const value = { ...this.workshopForm.value }
    
    this.workshopProcessArray.unshift(value.workshopProcess);
    this.resetWorkshopProcess();
  }

  resetWorkshopProcess(): void {
    this.workshopForm.get('workshopProcess').reset();
  }

  deleteWorkshopProcessArray(index: number): void {
    this.workshopProcessArray.splice(index, 1);
  }

  saveSubmitWorkshopForm(): void {
    try {
      this.loading.next(true);
      if (this.workshopForm.invalid) {
        this.workshopForm.markAllAsTouched();
        this.loading.next(false);
        return;
      }
      const resp = this.qualityService.addQualityInternalWorkshop(this.workshopForm, this.user, this.workshopProcessArray);
      this.subscription.add(
        resp.subscribe(
          batch => {
            if (batch) {
              batch.commit()
                .then(() => {
                  this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
                    duration: 6000
                  });
                  this.workshopProcessArray = [];
                  this.workshopForm.reset();

                  this.loading.next(false);
                })
                .catch(err => {
                  this.loading.next(false);
                  this.snackbar.open('🚨 Hubo un error al guardar  !', 'Aceptar', {
                    duration: 6000
                  });
                });
            }
          }
        ));

    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }

  addListDiffusion(broadcast: QualityBroadcastList, index: number): void {
    try {
      const name = broadcast.name;
      const newBroadcast = this.broadcastFormArray.controls[index].value.trim().toLowerCase();

      if (broadcast.id) {
        const entryId = broadcast.id;

        const resp = this.qualityService.updateBrodcastList(entryId, newBroadcast, this.user);
        //this.loading.next(true);
        this.subscription.add(
          resp.subscribe(
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

  deleteListResponsibleArea(item: any) {
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

  saveResponsibleArea() {
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

  public saveWorkshop(): void {
    try {
      const resp = this.qualityService.addWorkshopList(this.listWorkshopArray, this.user);

      this.loading1.next(true);
      this.subscription.add(
        resp.subscribe((batch) => {
          if (batch) {
            batch
              .commit()
              .then(() => {
                this.loading1.next(false);
                this.snackbar.open(
                  '✅ Lista taller creada!',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              })
              .catch((error: any) => {
                this.loading1.next(false);
                this.snackbar.open(
                  '🚨 Hubo un error creando la lista taller!',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              });
          }
        })
      );
    } catch (error: any) {
      console.error(error);
    }
  }

  public async addOrDeleteEntryWorkshopList(
    action: string,
    index?: number
  ): Promise<void> {
    switch (action) {
      case 'add': {
        // Add an item to the local ReasonsForRejection array
        if (this.entryWorkshopControl.valid) {
          const temp: WorkshopList = {
            id: null,
            name: this.entryWorkshopControl.value.trim(),
            createdBy: null,
            createdAt: null,
          };

          // Searching for repeated values
          const equal = (currentItem: WorkshopList) =>
            currentItem.name !== temp.name;
          if (this.listWorkshopArray.every(equal)) {
            this.listWorkshopArray.unshift(temp);
          }
          // Reset the text in the form control
          this.entryWorkshopControl.reset();
        }

        break;
      }
      case 'delete': {
        // Check if the item exists in the db
        if (this.listWorkshopArray[index].id) {
          this.loading1.next(true);
          const resp = this.qualityService.deleteWorshop(
            this.listWorkshopArray[index].id
          );
          this.subscription.add(
            resp.subscribe((batch) => {
              if (batch) {
                batch
                  .commit()
                  .then(() => {
                    this.loading1.next(false);
                    this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
                      duration: 6000,
                    });
                  })
                  .catch((error: any) => {
                    this.loading1.next(false);
                    this.snackbar.open(
                      '🚨 Hubo un error al eliminar la lista taller!',
                      'Aceptar',
                      {
                        duration: 6000,
                      }
                    );
                  });
              }
            })
          );
        }
        /// Delete an item from the local ReasonsForRejection array
        this.listWorkshopArray.splice(index, 1);
        break;
      }
    }
  }

  public saveComponentInternal(): void {
    try {
      const resp = this.qualityService.addComponentListInternal(this.listComponentInternalArray, this.user);

      this.loading2.next(true);
      this.subscription.add(
        resp.subscribe((batch) => {
          if (batch) {
            batch
              .commit()
              .then(() => {
                this.loading2.next(false);
                this.snackbar.open(
                  '✅ Lista componente interno creada!',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              })
              .catch((error: any) => {
                this.loading2.next(false);
                this.snackbar.open(
                  '🚨 Hubo un error creando la lista componente internos !',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              });
          }
        })
      );
    } catch (error: any) {
      console.error(error);
    }
  }

  public async addOrDeleteEntryComponentInternal(
    action: string,
    index?: number
  ): Promise<void> {
    switch (action) {
      case 'add': {
        // Add an item to the local ReasonsForRejection array
        if (this.entryComponentInternalControl.valid) {
          const temp: WorkshopList = {
            id: null,
            name: this.entryComponentInternalControl.value.trim(),
            createdBy: null,
            createdAt: null,
          };
          // Searching for repeated values
          const equal = (currentItem: WorkshopList) =>
            currentItem.name !== temp.name;
          if (this.listComponentInternalArray.every(equal)) {
            this.listComponentInternalArray.unshift(temp);
          }
          // Reset the text in the form control
          this.entryComponentInternalControl.reset();
        }

        break;
      }
      case 'delete': {
        // Check if the item exists in the db
        if (this.listComponentInternalArray[index].id) {
          this.loading2.next(true);
          const resp = this.qualityService.deleteComponentInternal(
            this.listComponentInternalArray[index].id
          );
          this.subscription.add(
            resp.subscribe((batch) => {
              if (batch) {
                batch
                  .commit()
                  .then(() => {
                    this.loading2.next(false);
                    this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
                      duration: 6000,
                    });
                  })
                  .catch((error: any) => {
                    this.loading2.next(false);
                    this.snackbar.open(
                      '🚨 Hubo un error al eliminar!',
                      'Aceptar',
                      {
                        duration: 6000,
                      }
                    );
                  });
              }
            })
          );
        }
        /// Delete an item from the local ReasonsForRejection array
        this.listComponentInternalArray.splice(index, 1);
        break;
      }
    }
  }

  public saveComponentExternal(): void {
    try {
      const resp = this.qualityService.addComponentListExternal(this.listComponentExternalArray, this.user);

      this.loading3.next(true);
      this.subscription.add(
        resp.subscribe((batch) => {
          if (batch) {
            batch
              .commit()
              .then(() => {
                this.loading3.next(false);
                this.snackbar.open(
                  '✅ Lista componente externo creada!',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              })
              .catch((error: any) => {
                this.loading3.next(false);
                this.snackbar.open(
                  '🚨 Hubo un error creando la lista componente internos !',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              });
          }
        })
      );
    } catch (error: any) {
      console.error(error);
    }
  }

  public async addOrDeleteEntryComponentExternalList(
    action: string,
    index?: number
  ): Promise<void> {
    switch (action) {
      case 'add': {
        // Add an item to the local ReasonsForRejection array
        if (this.entryComponentExternalControl.valid) {
          const temp: WorkshopList = {
            id: null,
            name: this.entryComponentExternalControl.value.trim(),
            createdBy: null,
            createdAt: null,
          };
          // Searching for repeated values
          const equal = (currentItem: WorkshopList) =>
            currentItem.name !== temp.name;
          if (this.listComponentExternalArray.every(equal)) {
            this.listComponentExternalArray.unshift(temp);
          }
          // Reset the text in the form control
          this.entryComponentExternalControl.reset();
        }

        break;
      }
      case 'delete': {
        // Check if the item exists in the db
        if (this.listComponentExternalArray[index].id) {
          this.loading3.next(true);
          const resp = this.qualityService.deleteComponentExternal(
            this.listComponentExternalArray[index].id
          );
          this.subscription.add(
            resp.subscribe((batch) => {
              if (batch) {
                batch
                  .commit()
                  .then(() => {
                    this.loading3.next(false);
                    this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
                      duration: 6000,
                    });
                  })
                  .catch((error: any) => {
                    this.loading3.next(false);
                    this.snackbar.open(
                      '🚨 Hubo un error al eliminar!',
                      'Aceptar',
                      {
                        duration: 6000,
                      }
                    );
                  });
              }
            })
          );
        }
        /// Delete an item from the local ReasonsForRejection array
        this.listComponentExternalArray.splice(index, 1);
        break;
      }
    }
  }

  public saveMiningOperation(): void {
    try {
      const resp = this.qualityService.addMiningOperationList(this.listMiningOperationArray, this.user);

      this.loading4.next(true);
      this.subscription.add(
        resp.subscribe((batch) => {
          if (batch) {
            batch
              .commit()
              .then(() => {
                this.loading4.next(false);
                this.snackbar.open(
                  '✅ Lista componente externo creada!',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              })
              .catch((error: any) => {
                this.loading4.next(false);
                this.snackbar.open(
                  '🚨 Hubo un error creando la lista componente internos !',
                  'Aceptar',
                  {
                    duration: 6000,
                  }
                );
              });
          }
        })
      );
    } catch (error: any) {
      console.error(error);
    }
  }

  public async addOrDeleteEntryMiningOperation(
    action: string,
    index?: number
  ): Promise<void> {
    switch (action) {
      case 'add': {
        // Add an item to the local ReasonsForRejection array
        if (this.entryMiningOperationControl.valid) {
          const temp: WorkshopList = {
            id: null,
            name: this.entryMiningOperationControl.value.trim(),
            createdBy: null,
            createdAt: null,
          };
          // Searching for repeated values
          const equal = (currentItem: WorkshopList) =>
            currentItem.name !== temp.name;
          if (this.listMiningOperationArray.every(equal)) {
            this.listMiningOperationArray.unshift(temp);
          }
          // Reset the text in the form control
          this.entryMiningOperationControl.reset();
        }

        break;
      }
      case 'delete': {
        // Check if the item exists in the db
        if (this.listMiningOperationArray[index].id) {
          this.loading4.next(true);
          const resp = this.qualityService.deleteMiningOperation(
            this.listMiningOperationArray[index].id
          );
          this.subscription.add(
            resp.subscribe((batch) => {
              if (batch) {
                batch
                  .commit()
                  .then(() => {
                    this.loading4.next(false);
                    this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
                      duration: 6000,
                    });
                  })
                  .catch((error: any) => {
                    this.loading4.next(false);
                    this.snackbar.open(
                      '🚨 Hubo un error al eliminar!',
                      'Aceptar',
                      {
                        duration: 6000,
                      }
                    );
                  });
              }
            })
          );
        }
        /// Delete an item from the local ReasonsForRejection array
        this.listMiningOperationArray.splice(index, 1);
        break;
      }
    }
  }

  deleteWorkshop(
    workshop : WorkshopModel
  ){
    this.dialog.open(DeleteWorkshopDialogComponent, {
      maxWidth: 500,
      width:'90vw',
      data:workshop
    })
  }

  editWorkshop(
    workshop : workshopForm
   ): void {


      this.dialog.open(EditWorkshopDialogComponent,{
        maxWidth: 500,
        width:'90vw',
        data:workshop
      })
     
  
  }


}
