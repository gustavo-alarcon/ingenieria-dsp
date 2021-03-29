import { MyErrorStateMatcher } from './../../evaluations/evaluations-settings/evaluations-settings.component';
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
import {
  QualityListSpecialist,
  QualityListResponsibleArea,
  QualityBroadcastList,
} from '../../../models/quality.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteBroadcastDialogComponent } from './dialogs/delete-broadcast-dialog/delete-broadcast-dialog.component';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AddBroadcastDialogComponent } from './dialogs/add-broadcast-dialog/add-broadcast-dialog.component';

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

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private qualityService: QualityService,
    private breakpoint: BreakpointObserver,
    public dialog: MatDialog,

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
    if (this.listSpecialistControl.valid) {
      const objAux: QualityListSpecialist = {
        id: null,
        specialist: this.listSpecialistControl.value.trim(),
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

  addListResponsibleArea(): void {
    if (this.listResponsibleAreasControl.valid) {
      const objAux: QualityListResponsibleArea = {
        id: null,
        responsable: this.listResponsibleAreasControl.value.trim(),
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
                this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
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
