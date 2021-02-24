import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-history-delete-dialog',
  templateUrl: './history-delete-dialog.component.html',
  styleUrls: ['./history-delete-dialog.component.sass']
})
export class HistoryDeleteDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  
  constructor() { }

  ngOnInit(): void {
  }

}
