import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EvaluationsBroadcastUser, EvaluationsKindOfTest, EvaluationsResultTypeUser, EvaluationsUser } from 'src/app/main/models/evaluations.model';
import { User } from 'src/app/main/models/user-model';
import * as XLSX from 'xlsx';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { EvaluationBroadcastList } from '../../../models/evaluations.model';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DeleteBroadcastDialogComponent } from './dialogs/delete-broadcast-dialog/delete-broadcast-dialog.component';
import { AddBroadcastDialogComponent } from './dialogs/add-broadcast-dialog/add-broadcast-dialog.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-evaluations-settings',
  templateUrl: './evaluations-settings.component.html',
  styleUrls: ['./evaluations-settings.component.scss']
})

export class EvaluationsSettingsComponent implements OnInit, OnDestroy {

  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();
  loadingKindOfTest = new BehaviorSubject<boolean>(true);
  loadingKindOfTest$ = this.loadingKindOfTest.asObservable();

  settingsDataSource = new MatTableDataSource<EvaluationsUser>();
  settingsDisplayedColumns: string[] = [
    'code',
    'name',
    'oficc',
    'workingArea',
    'description',
    'email',
    'userName',
    'boss',
    'bossEmail'
  ];


  @ViewChild('settingsPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.settingsDataSource.paginator = paginator;
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('fileInput2', { read: ElementRef }) fileButton: ElementRef;

  panelOpenState = false;

  user: User;

  listNotifyFormControl = new FormControl(null, [Validators.required, Validators.email]);
  listResultFormControl = new FormControl(null, [Validators.required]);
  listKindOfTestFormControl = new FormControl(null, [Validators.required]);

  listNotifyArray: EvaluationsBroadcastUser[] = [];
  listResultArray: EvaluationsResultTypeUser[] = [];
  listKindOfTestArray: EvaluationsKindOfTest[] = [];

  matcher = new MyErrorStateMatcher();

  private subscription = new Subscription();

  broadcast$: Observable<EvaluationBroadcastList[]>;
  broadcastListArray: EvaluationBroadcastList[] = [];
  broadcastFormArray = new FormArray([]);


  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private snackbar: MatSnackBar,
    private evalService: EvaluationsService,
  ) {

  }

  ngOnInit(): void {

    this.loading.next(true);
    this.loadingKindOfTest.next(true);
    this.settingsDataSource.sort = this.sort;
    this.subscription.add(this.authService.user$.subscribe(user => {
      this.user = user;
    }));

    this.subscription.add(
      this.evalService.getAllEvaluationsSettings().subscribe((resp) => {
        if (resp) {
          this.settingsDataSource.data = resp;
          this.settingsDataSource.sort = this.sort;
        } else {
          this.settingsDataSource.data = [];
        }
      })
    );
    this.subscription.add(
      this.evalService.getAllEvaluationsSettingsNotify().subscribe((resp) => {
        if (resp) {
          this.listNotifyArray = resp;
        } else {
          this.listNotifyArray = [];
        }
      })
    );

    this.subscription.add(
      this.evalService.getAllEvaluationsSettingsResultType().subscribe((resp) => {
        if (resp) {
          this.listResultArray = resp;
        } else {
          this.listResultArray = [];
        }
      })
    );

    this.subscription.add(
      this.evalService.getAllEvaluationsSettingsKindOfTest().subscribe((resp) => {
        if (resp) {
          this.listKindOfTestArray = resp;
        } else {
          this.listKindOfTestArray = [];
        }
      })
    );

    this.broadcast$ = this.evalService.getAllBroadcastList().pipe(
      tap((res: EvaluationBroadcastList[]) => {
        if (res) {
          this.broadcastListArray = res;
        }
        res.map((el) => {
          this.broadcastFormArray.push(
            new FormControl('', [
              Validators.required,
              Validators.pattern(/^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)
              ])
          );
        });
      })
    );

    this.loading.next(false);
    this.loadingKindOfTest.next(false);
  }

  saveDataList(): void {
    if (this.settingsDataSource.data.length > 0) {
      try {
        const resp = this.evalService.addEvaluationsSettings(this.settingsDataSource.data);
        this.loading.next(true);
        this.subscription.add(resp.subscribe(
          batchList => {

            if (batchList) {
              batchList.forEach(batch => {
                batch.commit()
                  .then(() => {
                    this.loading.next(false);
                    this.snackbar.open('✅ Lista de notificaciones creada!', 'Aceptar', {
                      duration: 6000
                    });
                  })
                  .catch(err => {
                    this.loading.next(false);
                    this.snackbar.open('🚨 Hubo un error creando la lista de notificaciones creada!', 'Aceptar', {
                      duration: 6000
                    });
                  });
              })
            }
          }
        ));
      } catch (error) {
        console.log(error);
        this.loading.next(false);
      }
    } else {
      return;
    }
  }

  saveDataNotify(): void {
    if (this.listNotifyArray.length > 0) {
      try {
        const resp = this.evalService.addEvaluationsSettingsNotify(this.listNotifyArray, this.user);
        this.loading.next(true);
        this.subscription.add(resp.subscribe(
          batch => {
            if (batch) {
              batch.commit()
                .then(() => {
                  this.loading.next(false);
                  this.snackbar.open('✅ Lista difución creada!', 'Aceptar', {
                    duration: 6000
                  });
                })
                .catch(err => {
                  this.loading.next(false);
                  this.snackbar.open('🚨 Hubo un error creando la lista de difución!', 'Aceptar', {
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
  }

  saveDataResult(): void {
    try {
      const resp = this.evalService.addEvaluationsSettingsResultType(this.listResultArray, this.user);
      this.loading.next(true);
      this.subscription.add(resp.subscribe(
        batch => {
          if (batch) {
            batch.commit()
              .then(() => {
                this.loading.next(false);
                this.snackbar.open('✅ Lista tipo de resultado creada!', 'Aceptar', {
                  duration: 6000
                });
              })
              .catch(err => {
                this.loading.next(false);
                this.snackbar.open('🚨 Hubo un error creando tipo de resultado!', 'Aceptar', {
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

  saveKindOfTest(): void {
    try {
      this.loadingKindOfTest.next(true);
      const resp = this.evalService.addEvaluationsSettingsKindOfTest(this.listKindOfTestArray, this.user);
      this.subscription.add(resp.subscribe(
        batch => {
          if (batch) {
            batch.commit()
              .then(() => {
                this.loading.next(false);
                this.snackbar.open('✅ Lista tipo de ensayo, creada!', 'Aceptar', {
                  duration: 6000
                });
              })
              .catch(err => {
                this.loadingKindOfTest.next(false);
                this.snackbar.open('🚨 Hubo un error creando tipo de ensayo!', 'Aceptar', {
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

  async addDeleteListNotify(validate: string, index?: number): Promise<void> {
    switch (validate) {
      case 'add':
        if (this.listNotifyFormControl.valid) {
          const objAux: EvaluationsBroadcastUser = {
            id: null,
            email: this.listNotifyFormControl.value.trim().toLowerCase(),
            createdAt: null,
            createdBy: null,
          };
          const valueIsEquals = (currentValue) => currentValue.email !== objAux.email;
          if (this.listNotifyArray.every(valueIsEquals)) {
            this.listNotifyArray.push(objAux);
          }
          this.listNotifyFormControl.reset();
        }
        break;
      case 'delete':
        if (this.listNotifyArray[index].id) {
          this.loading.next(true);
          await this.evalService.deleteEvaluationsSettingsNotify(this.listNotifyArray[index].id);
          this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
            duration: 6000
          });
          this.loading.next(false);
        }
        this.listNotifyArray.splice(index, 1);
        break;
    }
  }


  async addDeleteListResult(validate: string, index?: number): Promise<void> {
    switch (validate) {
      case 'add':
        if (this.listResultFormControl.valid) {
          const objAux: EvaluationsResultTypeUser = {
            id: null,
            resultType: this.listResultFormControl.value.trim(),
            createdAt: null,
            createdBy: null,
          };
          const valueIsEquals = (currentValue) => currentValue.resultType !== objAux.resultType;
          if (this.listResultArray.every(valueIsEquals)) {
            this.listResultArray.push(objAux);
          }
          this.listResultFormControl.reset();
        }
        break;
      case 'delete':
        if (this.listResultArray[index].id) {
          this.loading.next(true);
          await this.evalService.deleteEvaluationsSettingsResultType(this.listResultArray[index].id);
          this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
            duration: 6000
          });
          this.loading.next(false);
        }
        this.listResultArray.splice(index, 1);
        break;
    }
  }

  async addDeleteListKindOfTest(validate: string, index?: number): Promise<void> {
    switch (validate) {
      case 'add':
        if (this.listKindOfTestFormControl.valid) {
          const objAux: EvaluationsKindOfTest = {
            id: null,
            kindOfTest: this.listKindOfTestFormControl.value.trim(),
            createdAt: null,
            createdBy: null,
          };
          const valueIsEquals = (currentValue) => currentValue.kindOfTest !== objAux.kindOfTest;
          if (this.listKindOfTestArray.every(valueIsEquals)) {
            this.listKindOfTestArray.push(objAux);
          }
          this.listKindOfTestFormControl.reset();
        }
        break;
      case 'delete':
        if (this.listKindOfTestArray[index].id) {
          this.loading.next(true);
          await this.evalService.deleteEvaluationsSettingsKindOfTest(this.listKindOfTestArray[index].id);
          this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
            duration: 6000
          });
          this.loading.next(false);
        }
        this.listKindOfTestArray.splice(index, 1);
        break;
    }
  }

  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      this.loading.next(true);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const arrAux: EvaluationsUser[] = XLSX.utils.sheet_to_json(ws);
        const objArray = [];
        const date = new Date();
        arrAux.forEach((element) => {
          const obj: EvaluationsUser = {
            id: null,
            code: '',
            name: '',
            oficc: '',
            workingArea: '',
            description: '',
            email: '',
            userName: '',
            boss: '',
            bossEmail: '',
            createdAt: null,
            createdBy: this.user,
            editedAt: null,
            editedBy: null
          };
          obj.code = element['Código'] ? element['Código'] : null;
          obj.name = element['Nombre Completo'] ? element['Nombre Completo'] : null;
          obj.oficc = element['OFICC'] ? element['OFICC'] : null;
          obj.email = element['Correo'] ? element['Correo'] : null;
          obj.workingArea = element['Área de personal'] ? element['Área de personal'] : null;
          obj.description = element['Descripción Posición'] ? element['Descripción Posición'] : null;;
          obj.bossEmail = element['Correo Jefe'] ? element['Correo Jefe'] : null;
          obj.boss = element['Jefe'] ? element['Jefe'] : null;
          obj.userName = element['Usuario Windows'] ? element['Usuario Windows'] : null;
          objArray.push({ ...obj });
        });
        this.settingsDataSource.data = [...this.settingsDataSource.data, ...objArray];
        this.settingsDataSource.sort = this.sort;
        this.loading.next(false);
      };
      reader.readAsBinaryString(event.target.files[0]);
    } else {
      this.loading.next(false);
    }
  }

  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  //BROADCAST LIST

  addBroadcast(): void{
    this.dialog.open(AddBroadcastDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  addListDiffusion(broadcast: EvaluationBroadcastList, index: number): void {
    try {
      const name = broadcast.name;
      const newBroadcast = this.broadcastFormArray.controls[index].value.trim().toLowerCase();

      if ( broadcast.id){
        const entryId = broadcast.id;

        const resp = this.evalService.updateBrodcastList(entryId, newBroadcast, this.user);
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
    broadcast: EvaluationBroadcastList,
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
    broadcast: EvaluationBroadcastList,
    broadcastList: string
  ): void {
    try {
      const resp = this.evalService.updateBrodcastEmailList(
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
}
