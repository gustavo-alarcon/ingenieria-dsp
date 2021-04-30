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

  containerStyle: any;
  reportStyle: any;

  subscriptions = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    public router: Router,
    private andonService: AndonService,
    private auth: AuthService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      })
    )

    this.reportForm = this.fb.group({
      name: ['', Validators.required],
      otChild: ['', Validators.required],
    });

    this.loading.next(true);


    this.nameBahias$ = this.andonService.getAllAndonSettingsListBahias().pipe(
      tap((res: AndonListBahias[]) => {
        const arrayListBahia: AndonListBahias[] = res;

        arrayListBahia.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        return arrayListBahia;
      })
    );
    this.loading.next(false);

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  report(): void {
    this.loading.next(true);
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.loading.next(false);
      return;
    } else {
      const workShop = this.reportForm.value['name']['workShop'];
      const name = this.reportForm.value['name']['name'];
      const otChild = this.reportForm.value['otChild'];

      const code = `${workShop}-${name}-${otChild}`;
      this.router.navigate(['main/reporte', code]);

    }

  }

}
