import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EvaluationsUser } from 'src/app/main/models/evaluations.model';
import { User } from 'src/app/main/models/user-model';
import * as XLSX from 'xlsx';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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

  listNotifyFormControl = new FormControl('', [Validators.required, Validators.email]);
  listResultFormControl = new FormControl('', [Validators.required]);

  listNotifyArray: string[] = [];
  listResultArray: string[] = [];

  matcher = new MyErrorStateMatcher();

  private subscription = new Subscription();

  constructor(
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private evalService: EvaluationsService,
  ) {

  }

  ngOnInit(): void {
    this.loading.next(true);
    this.settingsDataSource.data = [];
    this.settingsDataSource.sort = this.sort;
    this.subscription.add(this.auth.user$.subscribe(user => {
      this.user = user;
    }));
    this.loading.next(false);
  }

  saveDataList(): void {
    if (this.settingsDataSource.data.length > 0) {
      try {
        const resp = this.evalService.addEvaluationsSettings(this.settingsDataSource.data);
        this.loading.next(true);
        this.subscription.add(resp.subscribe(
          batch => {
            if (batch) {
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
    if (this.settingsDataSource.data.length > 0) {
      // try {
      //   const resp = this.evalService.addEvaluationsSettings(this.settingsDataSource.data);
      //   this.loading.next(true);
      //   this.subscription.add(resp.subscribe(
      //     batch => {
      //       if (batch) {
      //         batch.commit()
      //           .then(() => {
      //             this.loading.next(false);
      //             this.snackbar.open('✅ Lista de notificaciones creada!', 'Aceptar', {
      //               duration: 6000
      //             });
      //           })
      //           .catch(err => {
      //             this.loading.next(false);
      //             this.snackbar.open('🚨 Hubo un error creando la lista de notificaciones creada!', 'Aceptar', {
      //               duration: 6000
      //             });
      //           });
      //       }
      //     }
      //   ));
      // } catch (error) {
      //   console.log(error);
      //   this.loading.next(false);
      // }
    } else {
      this.loading.next(false);
      return;
    }
  }

  saveDataResult(): void {
    if (this.settingsDataSource.data.length > 0) {
      // try {
      //   const resp = this.evalService.addEvaluationsSettings(this.settingsDataSource.data);
      //   this.loading.next(true);
      //   this.subscription.add(resp.subscribe(
      //     batch => {
      //       if (batch) {
      //         batch.commit()
      //           .then(() => {
      //             this.loading.next(false);
      //             this.snackbar.open('✅ Lista de notificaciones creada!', 'Aceptar', {
      //               duration: 6000
      //             });
      //           })
      //           .catch(err => {
      //             this.loading.next(false);
      //             this.snackbar.open('🚨 Hubo un error creando la lista de notificaciones creada!', 'Aceptar', {
      //               duration: 6000
      //             });
      //           });
      //       }
      //     }
      //   ));
      // } catch (error) {
      //   console.log(error);
      //   this.loading.next(false);
      // }
    } else {
      this.loading.next(false);
      return;
    }
  }

  addDeleteListNotify(validate: string, index?: number): void {
    switch (validate) {
      case 'add':
        if (this.listNotifyFormControl.valid) {
          this.listNotifyArray.push(this.listNotifyFormControl.value);
          this.listNotifyFormControl.reset();
        }
        break;
      case 'delete':
        this.listNotifyArray.splice(index, 1);
        break;
    }
  }


  addDeleteListResult(validate: string, index?: number): void {
    switch (validate) {
      case 'add':
        if (this.listResultFormControl.valid) {
          const value = this.listResultFormControl.value;
          this.listResultArray.push(value.trim());
          this.listResultFormControl.reset();
        }
        break;
      case 'delete':
        this.listResultArray.splice(index, 1);
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
            id: '',
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
        this.settingsDataSource.data = [...objArray];
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
}
