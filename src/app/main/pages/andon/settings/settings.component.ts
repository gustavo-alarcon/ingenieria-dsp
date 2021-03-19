import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MyErrorStateMatcher } from '../../evaluations/evaluations-settings/evaluations-settings.component';
import { AndonProblemType, AndonListBahias } from '../../../models/andon.model';
import { AuthService } from '../../../../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AndonService } from 'src/app/main/services/andon.service';
import { User } from '../../../models/user-model';
import { take, switchMap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private andonService: AndonService,
    private breakpoint: BreakpointObserver

  ) { }

  ngOnInit(): void {
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

    this.loading.next(false);
  }

  addListProblemType(): void {
    if (this.listProblemTypeFormControl.valid) {
      const objAux: AndonProblemType = {
        id: null,
        problemType: this.listProblemTypeFormControl.value.trim().toLowerCase(),
        createdAt: null,
        createdBy: null,
      };
      const valueIsEquals = (currentValue) => currentValue.problemType !== objAux.problemType;
      if (this.listProblemTypeArray.every(valueIsEquals)) {
        this.listProblemTypeArray.push(objAux);
      }
      this.listProblemTypeFormControl.reset();
    }
  }
  async deleteListProblemType(index: number): Promise<void> {
    if (this.listProblemTypeArray[index].id) {
      this.loading.next(true);
      await this.andonService.deleteAndonSettingsProblemType(this.listProblemTypeArray[index].id);
      this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
        duration: 6000
      });
      this.loading.next(false);
    }

    this.listProblemTypeArray.splice(index, 1);
    this.loading.next(false);

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
  saveDataProblemType(): void {
    try {
      const resp = this.andonService.addAndonSettingsProblemType(this.listProblemTypeArray, this.user);
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

}
