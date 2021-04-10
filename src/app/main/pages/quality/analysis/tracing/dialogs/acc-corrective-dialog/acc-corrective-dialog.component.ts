import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Quality } from '../../../../../../models/quality.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QualityService } from 'src/app/main/services/quality.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/main/models/user-model';

@Component({
  selector: 'app-acc-corrective-dialog',
  templateUrl: './acc-corrective-dialog.component.html',
  styleUrls: ['./acc-corrective-dialog.component.scss']
})
export class AccCorrectiveDialogComponent implements OnInit, OnDestroy {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  dataArea = [];
  
  fileSelect = false;
  nameFileSelect: string;
  uploadFileUrl: string;
  pathStorageFile: string;
  
  uploadPercent$: Observable<number>;

  subscription = new Subscription();
  
  newAccCorrective;

  date = new Date();
  userCurrent: User;

  constructor(
    public dialogRef: MatDialogRef<AccCorrectiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private qualityService: QualityService,

  ) { }
  ngOnInit(): void {
    this.initForm();

    this.subscription.add(
      this.authService.user$.subscribe((user) => {
        this.userCurrent = user;
      })
    );

    this.dataArea = [...this.data.correctiveActions];

    this.pathStorageFile = `quality/corrective-actions`;

  }

  initForm(): void{

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  uploadFiles(event, item ): void {

    if (!event.target.files[0]) {
      return;
    }

    const date = new Date();
    this.loading.next(true);
    const file = event.target.files[0];
    const filename = event.target.files[0].name;

    const name = `${this.pathStorageFile}/${date}-${filename}`;
    const fileRef = this.storage.ref(name);
    const task = this.storage.upload(name, file);

    this.uploadPercent$ = task.percentageChanges();
    this.subscription.add(
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((link) => {
              if (link) {
               const code = item.corrective;
               const kits = true;

               this.newAccCorrective = this.dataArea.map(el => {
                 if (el.corrective === code) {
                   return {...el, nameFile: filename, kit: kits, url: link, closedAt: this.date, user: this.userCurrent};
                 }else{
                   return el;
                 }
               });

               this.dataArea = this.newAccCorrective ;
              }
            });
            this.loading.next(false);
          })
        ).subscribe()
    );
  }
  
  save(): void{
    try {
      if (this.newAccCorrective) {
        const resp = this.qualityService.saveNewCorrectiveActions(
          this.data.id,
          this.newAccCorrective
        );
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {
              batch
                .commit()
                .then(() => {
                  this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
                    duration: 6000,
                  });
                  this.dialogRef.close(false);
                })
                .catch((err) => {
                  this.snackbar.open(
                    '🚨 Hubo un error al actualizar  !',
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
