import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { DetailsDialogComponent } from './dialogs/details-dialog/details-dialog.component';
import { ReturnDialogComponent } from './dialogs/return-dialog/return-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Andon } from '../../../models/andon.model';
import { AndonService } from '../../../services/andon.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  searchForm: FormGroup;
  currentWorkShop: string;
  workShop$: Observable<Andon[]>;
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

    this.workShop$ = this.andonService.getAndonByWorkShop(this.currentWorkShop).pipe(
      tap((res) => {
        return res;
      })
    );
  }
  editDialog(): void{

  }
  returnDialog(): void{
    this.dialog.open(ReturnDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      //data: item,
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

}
