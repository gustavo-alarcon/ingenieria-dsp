import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import { AndonService } from 'src/app/main/services/andon.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Andon, AndonListBahias } from '../../../models/andon.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  reportForm: FormGroup;

  nameBahias$: Observable<AndonListBahias[]>;

  private subscription = new Subscription();
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    public router: Router,
    private andonService: AndonService,
    private auth: AuthService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      name: ['', Validators.required],
      otChild: ['', Validators.required],
    });
    this.loading.next(true);


    this.nameBahias$ = this.andonService.getAllAndonSettingsListBahias().pipe(
      tap((res) => {
        return res;
      })
    );
    this.loading.next(false);

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  report(): void{
    this.loading.next(true);
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.loading.next(false);
      return;
    } else {
      this.auth.user$.pipe(
        take(1)).
        subscribe(user => {
          // create batch
          const batch = this.afs.firestore.batch();
          // create reference for document in andon entries collection
          const andonDocRef = this.afs.firestore.collection(`db/ferreyros/andon`).doc();
          // Structuring the data model
          const data: Andon = {
            id: andonDocRef.id,
            createdAt: new Date(),
            createdBy: user,
            editedAt: null,
            edited: null,
            reportDate: new Date(),
            workShop: this.reportForm.value['name']['workShop'],
            name: this.reportForm.value['name']['name'],
            otChild: this.reportForm.value['otChild'],
            problemType: null,
            description: null,
            images: null,
            atentionTime: new Date(),
            reportUser: user.name,
            state: 'stopped', // => stopped //retaken
            workReturnDate: null,
            comments: null,
            returnUser: null,
          };
          batch.set(andonDocRef, data);

          batch.commit().then(() => {
            //this.loading.next(false)
            this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
              duration: 6000
            });
            const code = andonDocRef.id;
            this.router.navigate(['main/reporte', code]);
          })
            .catch(err => {
              console.log(err);
              this.snackbar.open('🚨 Hubo un error.', 'Aceptar', {
                duration: 6000
              });
            })
        })
    }

  }
/* 
  report(): void {
    this.loading.next(true);
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.loading.next(false);
      return;
    } else {
      const name = this.reportForm.value['name'];
      const otChild = this.reportForm.value['otChild'];
      const id = `${name}-${otChild}`;

      this.router.navigate(['main/reporte', id]);
      this.loading.next(false);
    }
  } */
}
