import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Andon } from '../../../../../models/andon.model';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {
  images: string[];

  constructor(
             @Inject(MAT_DIALOG_DATA) public data: Andon,
  ) {
    if (data.images) {
      const arr = Object.values(data.images);
      this.images = [...arr];
    } else {
      this.images = [];
    }
   }

  ngOnInit(): void {
  }

}
