import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/main/models/user-model';
import { QualityService } from 'src/app/main/services/quality.service';
import { MyErrorStateMatcher } from '../../evaluations/evaluations-settings/evaluations-settings.component';
import {
  QualityListSpecialist,
  QualityListResponsibleArea,
  QualityBroadcastList,
} from '../../../models/quality.model';

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

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private qualityService: QualityService,
    private breakpoint: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.breakpoint
        .observe([Breakpoints.HandsetPortrait])
        .subscribe((res) => {
          if (res.matches) {
            this.isMobile = true;
            this.setHandsetContainer();
          } else {
            this.isMobile = false;
            this.setDesktopContainer();
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
      this.auth.user$.subscribe((user) => {
        this.user = user;
      })
    );

    this.subscription.add(
      this.qualityService.getAllQualityListSpecialist().subscribe((resp) => {
        if (resp) {
          this.listSpecialistArray = resp;
        } else {
          this.listSpecialistArray = [];
        }
      })
    );

    this.subscription.add(
      this.qualityService
        .getAllQualityListResponsibleAreas()
        .subscribe((resp) => {
          if (resp) {
            this.listResponsibleAreasArray = resp;
          } else {
            this.listResponsibleAreasArray = [];
          }
        })
    );

    this.loading.next(false);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addDiffusion(): void {
    const lenghtArray = this.broadcastListArray.length;
    const nameBroadcast = `difusion ${lenghtArray + 1}`;

    const arrayList: QualityBroadcastList = {
      id: null,
      name: nameBroadcast,
      emailList: null,
      createdAt: null,
      createdBy: null,
    };
    this.broadcastFormArray.push(new FormControl(null, Validators.required));

    this.broadcastListArray.push(arrayList);
  }

  addListDiffusion(broadcast: QualityBroadcastList, index: number): void {
  
    try {
      let name = broadcast.name;
      let newBroadcast = this.broadcastFormArray.controls[index].value.trim().toLowerCase();

      if (broadcast.id === null) {
        const resp = this.qualityService.addNewBrodcastList(newBroadcast, name, this.user);
        //this.loading.next(true);
        this.subscription.add(resp.subscribe(
          batch => {
            if (batch) {
              batch.commit()
                .then(() => {
                // this.loading.next(false);
                  this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
                    duration: 6000
                  });
                  this.broadcastFormArray.removeAt(index);
                })
                .catch(err => {
                // this.loading.next(false);
                  this.snackbar.open('🚨 Hubo un error al crear!', 'Aceptar', {
                    duration: 6000
                  });
                });
            }
          }
        ));

      }else{
        let entryId = broadcast.id;

        const resp = this.qualityService.updateBrodcastList(entryId, newBroadcast, this.user);
        //this.loading.next(true);
        this.subscription.add(resp.subscribe(
          batch => {
            if (batch) {
              batch.commit()
                .then(() => {
                // this.loading.next(false);
                  this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
                    duration: 6000
                  });
                  this.broadcastFormArray.removeAt(index);

                })
                .catch(err => {
                // this.loading.next(false);
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
    console.log('broadcast:', broadcast);
    console.log('index:', index);
    if (broadcast.id != null) {
      this.loading.next(true);
      await this.qualityService.deleteListBroadcast(broadcast.id);
      this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
        duration: 6000,
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
                this.snackbar.open('✅ se elimino correctamente!', 'Aceptar', {
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
    if (this.listSpecialistControl.valid) {
      const objAux: QualityListSpecialist = {
        id: null,
        specialist: this.listSpecialistControl.value.trim().toLowerCase(),
        createdAt: null,
        createdBy: null,
      };
      const valueIsEquals = (currentValue) =>
        currentValue.specialist !== objAux.specialist;
      if (this.listSpecialistArray.every(valueIsEquals)) {
        this.listSpecialistArray.push(objAux);
      }
      this.listSpecialistControl.reset();
    }
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
                this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
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

  addListResponsibleArea(): void {
    if (this.listResponsibleAreasControl.valid) {
      const objAux: QualityListResponsibleArea = {
        id: null,
        responsable: this.listResponsibleAreasControl.value
          .trim()
          .toLowerCase(),
        createdAt: null,
        createdBy: null,
      };
      const valueIsEquals = (currentValue) =>
        currentValue.responsable !== objAux.responsable;
      if (this.listResponsibleAreasArray.every(valueIsEquals)) {
        this.listResponsibleAreasArray.push(objAux);
      }
      this.listResponsibleAreasControl.reset();
    }
  }
  async deleteListResponsibleArea(index: number): Promise<void> {
    if (this.listResponsibleAreasArray[index].id) {
      this.loading.next(true);
      await this.qualityService.deleteQualityListResponsibleAreas(
        this.listResponsibleAreasArray[index].id
      );
      this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
        duration: 6000,
      });
      this.loading.next(false);
    }

    this.listResponsibleAreasArray.splice(index, 1);
    this.loading.next(false);
  }

  saveListResponsibleArea(): void {
    try {
      const resp = this.qualityService.addQualityListResponsibleAreas(
        this.listResponsibleAreasArray,
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
                this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
                  duration: 6000,
                });
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
    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
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
