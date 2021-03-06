import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { AndonService } from 'src/app/main/services/andon.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  reportForm: FormGroup;
  
  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private andonService:AndonService,
    private auth: AuthService,
    private snackbar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      name: ['', Validators.required],
      otChild: ['', Validators.required]
    });
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
      const name =this.reportForm.value['name'];
      const otChild = this.reportForm.value['otChild'];
      const id = `${name}-${otChild}`

      this.router.navigate(['main/reporte',id]);
      
      this.loading.next(false);
    }

  }

}
