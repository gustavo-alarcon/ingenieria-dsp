import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { DetailsDialogComponent } from './dialogs/details-dialog/details-dialog.component';
import { ReturnDialogComponent } from './dialogs/return-dialog/return-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { Andon } from '../../../models/andon.model';
import { AndonService } from '../../../services/andon.service';
import { tap, debounceTime, filter, startWith, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  searchForm: FormGroup;
  currentWorkShop: string;
  workShop$: Observable<Andon[]>;
  state = 'stopped';

  isMobile = false;
  containerStyle: any;
  searchStyle: any;

  subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private andonService: AndonService,
    private breakpoint: BreakpointObserver
  ) {
    this.currentWorkShop = this.route.snapshot.paramMap.get('code');
  }

  ngOnInit(): void {
    this.subscription.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile= true;
          this.setHandsetContainer();
          this.setHandsetSearch();
        } else {
          this.isMobile= false;
          this.setDesktopContainer();
          this.setDesktopSearch();
        }
      })
    )

    this.searchForm = this.fb.group({
      search: ['', Validators.required],
    });

    this.workShop$ = combineLatest(
      this.andonService.getAndonByWorkShop(this.currentWorkShop, this.state),
      this.searchForm.get('search').valueChanges.pipe(
        debounceTime(300),
        filter((input) => input !== null),
        startWith<any>('')
      )
    ).pipe(
      map(([andons, search]) => {
        const searchTerm = search.toLowerCase().trim();
        let preFilterSearch: Andon[] = [...andons];

        preFilterSearch = andons.filter((andon) => {
          return (
            String(andon.name).toLowerCase().includes(searchTerm) ||
            String(andon.otChild).toLowerCase().includes(searchTerm)
          );
        });

        preFilterSearch.map((andon) => {
          if (andon.registryTimer) {
            clearInterval(andon.registryTimer);
          }

          andon.registryTimer = setInterval (() => {
            // Get today's date and time
            const now = new Date().getTime();
            const registry = andon.createdAt['seconds'] * 1000;
            // Find the distance between now and the count down date
            const distance = now - registry;

            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            andon.atentionTime = {
              days: days,
              hours: hours,
              minutes: minutes,
              seconds: seconds,
            };
          }, 1000);
        });

        return preFilterSearch;
      })
    );
  }
  editDialog(): void {}
  returnDialog(item): void {
    this.dialog.open(ReturnDialogComponent, {
      maxWidth: 450,
      width: '90vw',
      data: item,
    });
  }
  detailsDialog(item): void {
    this.dialog.open(DetailsDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: item,
    });
  }

  deleteDialog(item): void {
    this.dialog.open(DeleteDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: item,
    });
  }
  dashboard(): void {
    this.router.navigate(['main/dashboard']);
  }

  getTime(time) {
    let milis = new Date().getTime() - time.toMillis();
    function addZ(n) {
      return (n < 10 ? '0' : '') + n;
    }
    const ms = milis % 1000;
    milis = (milis - ms) / 1000;
    const secs = milis % 60;
    milis = (milis - secs) / 60;
    const mins = milis % 60;
    const hrs = (milis - mins) / 60;

    return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs);
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

  setHandsetSearch(): void {
    this.searchStyle = {
      'margin': '12px 0px'
    }
  }

  setDesktopSearch(): void {
    this.searchStyle = {
      'margin': '0px',
    }
  }
}
