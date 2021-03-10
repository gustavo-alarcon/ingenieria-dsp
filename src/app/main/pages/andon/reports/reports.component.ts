import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { DetailsDialogComponent } from './dialogs/details-dialog/details-dialog.component';
import { ReturnDialogComponent } from './dialogs/return-dialog/return-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { Andon } from '../../../models/andon.model';
import { AndonService } from '../../../services/andon.service';
import { tap, debounceTime, filter, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  searchForm: FormGroup;
  currentWorkShop: string;
  workShop$: Observable<Andon[]>;
  state = 'stopped';
  constructor(
              public dialog: MatDialog,
              public router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private andonService: AndonService,

    ) {
      this.currentWorkShop = this.route.snapshot.paramMap.get('code');
     }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['', Validators.required]
    });

    this.workShop$ = combineLatest(
      this.andonService.getAndonByWorkShop(this.currentWorkShop, this.state) ,
       this.searchForm.get('search').valueChanges.pipe(
        debounceTime(300),
        filter(input => input !== null),
        startWith<any>('')),
    ).pipe(
      map(([andons, search]) => {

        const searchTerm = search.toLowerCase().trim();
        let preFilterSearch: Andon[] = [...andons];
       
        preFilterSearch = andons.filter(andon => {
            return String(andon.name).toLowerCase().includes(searchTerm) ||
              String(andon.otChild).toLowerCase().includes(searchTerm)
          });

        return preFilterSearch;
      }),
    );
  }
  editDialog(): void{

  }
  returnDialog(item): void{
    this.dialog.open(ReturnDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: item,
    });
  }
  detailsDialog(item): void{
    this.dialog.open(DetailsDialogComponent, {
      maxWidth: 500,
      width: '60vw',
      data: item,
    });
  }

  deleteDialog(item): void{
      this.dialog.open(DeleteDialogComponent, {
        maxWidth: 500,
        width: '90vw',
        data: item,
      });
    }
  dashboard(): void{
    this.router.navigate(['main/dashboard']);
  }

  getTime(time) {
    let milis = new Date().getTime() - time.toMillis()
    function addZ(n) {
      return (n < 10 ? '0' : '') + n;
    }
    let ms = milis % 1000;
    milis = (milis - ms) / 1000;
    let secs = milis % 60;
    milis = (milis - secs) / 60;
    let mins = milis % 60;
    let hrs = (milis - mins) / 60;

    return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs);

  }

}
