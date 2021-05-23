import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from '../../models/user-model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users$: Observable<Array<User>>;
  users: Array<User> = [];

  searchControl = new FormControl('');

  // Users
  usersDataSource = new MatTableDataSource<User>();
  usersDisplayedColumns: string[] = ['createdAt', 'name', 'email', 'role', 'actions'];

  @ViewChild('usersPaginator', { static: false }) set content(paginator: MatPaginator) {
    this.usersDataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set sortContent(sort: MatSort) {
    this.usersDataSource.sort = sort;
  }

  subscriptions = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    private auth: AuthService,
    public snackbar: MatSnackBar,
    private afFun: AngularFireFunctions
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

    this.users$ = this.auth.getUsers().pipe(
      tap(res => {
        this.users = [...res];
        this.usersDataSource.data = [...res];
      }),
      tap(users => {
        users.forEach(user => {
          this.setTechnician(user);
          console.log(user.name);
        })
        console.log('USERS UPDATED');

      })
    )
  }

  setSuperuser(user: User) {
    const callable = this.afFun.httpsCallable('setClaimsAsSuperuser')
    callable({ uid: user.uid })
      .pipe(
        take(1)
      ).subscribe(res => {
        this.snackbar.open(res, 'Aceptar', {
          duration: 6000
        });
      })
  }

  setAdministrator(user: User) {
    const callable = this.afFun.httpsCallable('setClaimsAsAdministrator')
    callable({ uid: user.uid })
      .pipe(
        take(1)
      ).subscribe(res => {
        this.snackbar.open(res, 'Aceptar', {
          duration: 6000
        });
      })
  }

  setTechnician(user: User) {
    const callable = this.afFun.httpsCallable('setClaimsAsTechnician')
    callable({ uid: user.uid })
      .pipe(
        take(1)
      ).subscribe(res => {
        this.snackbar.open(res, 'Aceptar', {
          duration: 6000
        });
      })
  }

  sortData(sort: Sort) {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.usersDataSource.data = data;
      return;
    }

    this.usersDataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'createdAt': return compare(a.createdAt['seconds'], b.createdAt['seconds'], isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        case 'role': return compare(a.role, b.role, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
