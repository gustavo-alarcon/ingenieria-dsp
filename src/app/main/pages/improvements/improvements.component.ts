import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogInsertImprovementsComponent } from '../../components/dialog-insert-improvements/dialog-insert-improvements.component';
import { DialogValidationLogisticsComponent } from '../../components/dialog-validation-logistics/dialog-validation-logistics.component';

@Component({
  selector: 'app-improvements',
  templateUrl: './improvements.component.html',
  styleUrls: ['./improvements.component.scss']
})
export class ImprovementsComponent implements OnInit{


  improvenmentsForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.createFormListParts();
  }

  openDialog(value: string): void {
    const sizeModal = {
      width: '100%',
      height: '90%'
    };
    switch (value) {
      case 'insert':
        const dialogRefInsert = this.dialog.open(DialogInsertImprovementsComponent,
          sizeModal
        );
        dialogRefInsert.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'edit':
        const dialogRefEdit = this.dialog.open(DialogValidationLogisticsComponent,
          sizeModal
        );
        dialogRefEdit.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }

  createFormListParts(): void {
    this.improvenmentsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      model: ['', Validators.required],
      component: ['', Validators.required],
      date: ['', Validators.required],
      criticalPart: [false, Validators.required],
      rate: [false, Validators.required],
      parts: this.fb.array([
        ['', Validators.required],
        ['', Validators.required],
        ['', Validators.required],
        ['', Validators.required],
        ['', Validators.required],
      ], Validators.required)
    });
  }


}
