import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MyErrorStateMatcher } from '../../evaluations/evaluations-settings/evaluations-settings.component';
import { AndonProblemType, AndonListBahias, AndonBroadcastList } from '../../../models/andon.model';
import { AuthService } from '../../../../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AndonService } from 'src/app/main/services/andon.service';
import { User } from '../../../models/user-model';
import { take, switchMap, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DeleteBroadcastDialogComponent } from './dialogs/delete-broadcast-dialog/delete-broadcast-dialog.component';
import { AddBroadcastDialogComponent } from './dialogs/add-broadcast-dialog/add-broadcast-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditProblemTypeComponent } from './dialogs/edit-problem-type/edit-problem-type.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  panelOpenState = false;
  listBahiasForm: FormGroup;


  listProblemTypeFormControl = new FormControl(null, [Validators.required]);
  matcher = new MyErrorStateMatcher();
  listProblemTypeArray: AndonProblemType[] = [];
  listNameBahiaArray: AndonListBahias[] = [];

  private subscription = new Subscription();
  user: User;

  isMobile = false;
  containerStyle: any;

  broadcast$: Observable<AndonBroadcastList[]>;
  broadcastListArray: AndonBroadcastList[] = [];
  broadcastFormArray = new FormArray([]);
  emailList: string[] = [];
  
   
  historyMobilDataSource = new MatTableDataSource<AndonProblemType>();
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

  problemType$: Observable<AndonProblemType[]>;
  
  problemTypeForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private andonService: AndonService,
    private breakpoint: BreakpointObserver

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.subscription.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile = true;
          this.setHandsetContainer();
        } else {
          this.isMobile = false;
          this.setDesktopContainer();
        }
      })
    )

    this.listBahiasForm = this.fb.group({
      bahias: this.fb.array([
        this.fb.group({
          workShop: ['', Validators.required],
          name: ['', Validators.required],
        })
      ])
    });

    this.loading.next(true);
    this.subscription.add(this.auth.user$.subscribe(user => {
      this.user = user;
    }));

    this.subscription.add(
      this.andonService.getAllAndonSettingsProblemType().subscribe((resp) => {
        if (resp) {
          this.listProblemTypeArray = resp;
        } else {
          this.listProblemTypeArray = [];
        }
      })
    );

    this.subscription.add(
      this.andonService.getAllAndonSettingsListBahias()
      .subscribe((resp) => {
        if (resp) {
          this.listNameBahiaArray = resp;
        } else {
          this.listProblemTypeArray = [];
        }
      })
    );

    this.broadcast$ = this.andonService.getAllBroadcastList().pipe(
      tap((res: AndonBroadcastList[]) => {
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
    
    this.problemType$ = this.andonService.getAllAndonProblemType().pipe(
      tap((resp) => {
          if (resp) {
            this.historyMobilDataSource.data = resp;
          } else {
            this.historyMobilDataSource.data = [];
          }
        }
      )
      );
    this.loading.next(false);
  }

  initForm(): void{
    this.problemTypeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.pattern(/^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)
        ]],
    });
  }



  deleteProblemType(problemType: AndonProblemType): void{

    this.dialog.open(DeleteBroadcastDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: problemType,
    });
    // const index = item.id;
    // try {
    //     const resp = this.andonService.deleteAndonProblemType(
    //     index
    //     );
    //     this.subscription.add(
    //       resp.subscribe((batch) => {
    //         if (batch) {
    //           batch
    //             .commit()
    //             .then(() => {
    //               this.snackbar.open('✅ Se borrado correctamente!', 'Aceptar', {
    //                 duration: 6000,
    //               });
    //             })
    //             .catch((err) => {
    //               this.snackbar.open('🚨 Hubo un error al crear!', 'Aceptar', {
    //                 duration: 6000,
    //               });
    //             });
    //         }
    //       })
    //     );

    // } catch (error) {
    //   console.log(error);
    //   this.loading.next(false);
    // }
  }

  editProblem(problem: AndonProblemType): void {
    this.dialog.open(EditProblemTypeComponent, {
      maxWidth: 500,
      width: '90vw',
      data: problem,
    });
  }

  addEmail(): void {

    if (this.problemTypeForm.get('name').invalid) {
      this.problemTypeForm.markAllAsTouched();
      return;
    }
 
    const value = { ...this.problemTypeForm.value };

    this.emailList.unshift(value.email);
    this.resetEmail();
  }

  resetEmail(): void {
    this.problemTypeForm.get('email').reset();
    
  }

  
  deleteEmailArray(index: number): void {
    this.emailList.splice(index, 1);
  }
  saveProblemType(): void{
    try {
      this.loading.next(true)    
       
      if(this.problemTypeForm.invalid){
        this.problemTypeForm.markAllAsTouched();
        this.loading.next(false)
        return
      }
      if (this.problemTypeForm.valid) {
        const resp = this.andonService.addAndonProblemType(
          this.problemTypeForm.value,
          this.user,
          this.emailList
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
                  this.emailList = [];
                  this.problemTypeForm.reset();
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



  deleteNameBahia(item: AndonListBahias): void{
    try {
      this.loading.next(true);
      if (item) {
        this.andonService.deleteAndonListBahia(item.id)
        .pipe(
          take(1)
        ).subscribe(batch => {
          batch.commit()
            .then(() => {
              this.snackbar.open('✅ Registro borrado correctamente', 'Aceptar', {
                duration: 6000
              });
              this.loading.next(false);
            });
        });
      }
    } catch (error) {
      this.snackbar.open('✅ Error al borrar el registro', 'Aceptar', {
        duration: 6000
      });
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get bahias(): FormArray {
    return this.listBahiasForm.get('bahias') as FormArray;
  }
  addControl(): void {
    const group = this.fb.group({
      workShop: ['', Validators.required],
      name: ['', Validators.required],
    });

    this.bahias.push(group);
  }
  deleteControl(index: number): void {
    this.bahias.removeAt(index);
  }

  save(): void {
    this.loading.next(true);
    if (this.listBahiasForm.invalid) {
      this.listBahiasForm.markAllAsTouched();
      this.loading.next(false);
      return;
    } else {
      this.auth.user$.pipe(
        take(1),
        switchMap(user => {
          return this.andonService.createListBahiasAndon(this.listBahiasForm.value, user);
        })
      ).subscribe(batch => {
        if (batch) {
          batch.commit()
            .then(() => {
              this.loading.next(false);
              this.snackbar.open('✅ Mejoras registradas!', 'Aceptar', {
                duration: 6000
              });
              this.listBahiasForm.reset();
            })
            .catch(err => {
              this.loading.next(false);
              this.snackbar.open('🚨 Hubo un error guardando las mejoras!', 'Aceptar', {
                duration: 6000
              });
            });
        }
      });
    }

  }

  setHandsetContainer(): void {
    this.containerStyle = {
      'margin': '30px 24px 30px 24px'
    }
  }

  setDesktopContainer(): void {
    this.containerStyle = {
      'margin': '30px 80px 30px 80px',
    }
  }

  
  //BROADCAST LIST

  addBroadcast(): void{
    this.dialog.open(AddBroadcastDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  addListDiffusion(broadcast: AndonBroadcastList, index: number): void {
    try {
      const name = broadcast.name;
      const newBroadcast = this.broadcastFormArray.controls[index].value.trim().toLowerCase();

      if ( broadcast.id){
        const entryId = broadcast.id;

        const resp = this.andonService.updateBrodcastList(entryId, newBroadcast, this.user);
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
    broadcast: AndonBroadcastList,
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
    broadcast: AndonBroadcastList,
    broadcastList: string
  ): void {
    try {
      const resp = this.andonService.updateBrodcastEmailList(
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
