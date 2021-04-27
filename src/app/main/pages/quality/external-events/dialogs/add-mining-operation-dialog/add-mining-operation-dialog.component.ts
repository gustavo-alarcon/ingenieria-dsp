import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { User } from '../../../../../models/user-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QualityService } from 'src/app/main/services/quality.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs/operators';
import { MiningOperation } from '../../../../../models/quality.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-add-mining-operation-dialog',
  templateUrl: './add-mining-operation-dialog.component.html',
  styleUrls: ['./add-mining-operation-dialog.component.scss']
})
export class AddMiningOperationDialogComponent implements OnInit {

  form: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  user: User;

  subscription = new Subscription();

  dataSource = new MatTableDataSource<MiningOperation>();
  displayedColumns: string[] = [
    'miningOperation',
    'date',
    'actions'
  ];

  @ViewChild('paginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.dataSource.paginator = paginator;
  }

  miningOperation$: Observable<MiningOperation[]>;

  constructor(
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private qualityService: QualityService,
        private authService: AuthService,
        public dialog: MatDialog,

        ) { }

  ngOnInit(): void {
    this.initForm();
    this.subscription.add(
      this.authService.user$.subscribe((user) => {
        this.user = user;
      })
    );

    this.miningOperation$ =  this.qualityService.getAllMiningOperationList()
    .pipe(tap(res => {
      this.dataSource.data = res;
    }
     ));
  }

  initForm(){
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  save(): void {
    try {
      const value =  this.form.get('name').value;
      const exists = this.dataSource.data.every((item) => {
        return item.name.toLowerCase() !== value.toLowerCase();
      });

      this.loading.next(true);
      if (this.form.invalid || !exists ) {
        this.form.markAllAsTouched();
        this.loading.next(false);
        this.snackbar.open(`✅ ${value} ya existe en lista`, 'Aceptar', {
          duration:5000,
        });
        return;
      } else {
        this.qualityService
        .addMiningOperationList(this.form.value, this.user)
        .pipe(take(1))
        .subscribe((res) => {
          res.commit().then(() => {
            this.snackbar.open('✅ Se guardado correctamente', 'Aceptar', {
              duration:5000,
            });
            this.form.reset();
            this.loading.next(false);
          })
          .catch(err => {
            this.loading.next(false);
            this.snackbar.open('🚨 Hubo un error al agregar!', 'Aceptar', {
              duration: 5000
            });
          });
        });
      }

    } catch (error) {
      console.log('error', error )
      this.snackbar.open('🚨 Hubo un error!', 'Aceptar', {
        duration: 6000,
      });
    }
  }
  deleteItem(id): void{
    try {
      if (id){
        const resp = this.qualityService.deleteMiningOperation( id );
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {
              batch
                .commit()
                .then(() => {
                  this.snackbar.open('✅ Se borro correctamente !', 'Aceptar', {
                    duration: 6000,
                  });
                })
                .catch((err) => {
                  this.snackbar.open(
                    '🚨 Hubo un error !',
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
    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }

}
