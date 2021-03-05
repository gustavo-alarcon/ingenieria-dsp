import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { DetailsDialogComponent } from './dialogs/details-dialog/details-dialog.component';
import { ReturnDialogComponent } from './dialogs/return-dialog/return-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  searchForm: FormGroup;

  constructor(
              public dialog: MatDialog,
              public router: Router,
              private fb: FormBuilder,

    ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['', Validators.required]
    })
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
  detailsDialog(): void{
    this.dialog.open(DetailsDialogComponent, {
      maxWidth: 500,
      width: '60vw',
      //data: item,
    });
  }

  deleteDialog(): void{
      this.dialog.open(DeleteDialogComponent, {
        maxWidth: 500,
        width: '90vw',
        //data: item,
      });
    }
  dashboard(): void{
    this.router.navigate(['main/dashboard']);
  }

}
