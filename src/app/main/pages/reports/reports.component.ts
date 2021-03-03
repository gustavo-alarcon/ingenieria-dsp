import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { DetailsDialogComponent } from './dialogs/details-dialog/details-dialog.component';
import { ReturnDialogComponent } from './dialogs/return-dialog/return-dialog.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  searchForm: FormGroup;

  constructor(    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
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

}
