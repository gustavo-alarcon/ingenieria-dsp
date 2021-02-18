import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-improvements',
  templateUrl: './improvements.component.html',
  styleUrls: ['./improvements.component.scss']
})
export class ImprovementsComponent implements OnInit {
  displayedColumns: string[] = ['date', 'name','user', 'state', 'actions'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PeriodicElement {
  name: string;
  date: number;
  state: number;
  user: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {date: 1, name: 'Hydrogen', state: 1.0079, user: 'H'},
  {date: 2, name: 'Helium', state: 4.0026, user: 'He'},
  {date: 3, name: 'Lithium', state: 6.941, user: 'Li'},
  {date: 4, name: 'Beryllium', state: 9.0122, user: 'Be'},
  {date: 5, name: 'Boron', state: 10.811, user: 'B'},
  {date: 6, name: 'Carbon', state: 12.0107, user: 'C'},
  {date: 7, name: 'Nitrogen', state: 14.0067, user: 'N'},
  {date: 8, name: 'Oxygen', state: 15.9994, user: 'O'},
  {date: 9, name: 'Fluorine', state: 18.9984, user: 'F'},
  {date: 10, name: 'Neon', state: 20.1797, user: 'Ne'},
];
