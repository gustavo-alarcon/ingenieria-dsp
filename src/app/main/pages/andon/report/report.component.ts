import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AndonService } from 'src/app/main/services/andon.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Andon, AndonListBahias } from '../../../models/andon.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


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

  isMobile = false;
  containerStyle: any;
  reportStyle: any;

  subscription = new Subscription();
  
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    public router: Router,
    private andonService: AndonService,
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private breakpoint: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile= true;
          this.setHandsetContainer();
          this.setHandsetReport();
        } else {
          this.isMobile= false;
          this.setDesktopContainer();
          this.setDesktopReport();
        }
      })
    )

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

  report(): void {
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
            atentionTime: null,
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

  setHandsetReport(): void {
    this.reportStyle = {
      'width': 'fit-content',
      'margin': '24px auto',
    }
  }

  setDesktopReport(): void {
    this.reportStyle = {
      'padding': '24px 24px',
      'border': '1px solid lightgrey',
      'border-radius': '10px 10px 10px 10px',
      'width': 'fit-content',
      'margin': '24px auto',
      'box-shadow': '2px 2px 4px lightgrey'
    }
  }

}
