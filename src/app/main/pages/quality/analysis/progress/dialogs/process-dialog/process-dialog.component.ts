import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/main/models/user-model';
import { QualityService } from 'src/app/main/services/quality.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProcessList } from 'src/app/main/models/quality.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-process-dialog',
  templateUrl: './process-dialog.component.html',
  styleUrls: ['./process-dialog.component.scss']
})
export class ProcessDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  user: User;

  subscription = new Subscription();

  dataSource = new MatTableDataSource<ProcessList>();
  displayedColumns: string[] = [
    'component',
    'date',
    'actions'
  ];

  @ViewChild('paginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.dataSource.paginator = paginator;
  }

  process$: Observable<ProcessList[]>;

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

    this.process$ =  this.qualityService.getAllProcessList()
    .pipe(tap(res => {
      this.dataSource.data = res;
    }
     ));
  }

  initForm(): void{
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
        .addProcessList(this.form.value, this.user)
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
        const resp = this.qualityService.deleteProcess( id );
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
