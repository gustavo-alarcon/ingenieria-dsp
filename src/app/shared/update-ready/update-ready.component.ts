import { Platform } from '@angular/cdk/platform';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-ready',
  templateUrl: './update-ready.component.html',
  styleUrls: ['./update-ready.component.scss']
})
export class UpdateReadyComponent implements OnInit {

  constructor(
    public platform: Platform,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
  }

}
