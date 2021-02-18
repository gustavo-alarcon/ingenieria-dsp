import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-improvements',
  templateUrl: './improvements.component.html',
  styleUrls: ['./improvements.component.scss']
})
export class ImprovementsComponent implements OnInit {

   //Improvement
  improvementDataSource = new MatTableDataSource<Improvements>(improvements);
  improvementDisplayedColumns: string[] = ['date',  'name','component', 'model', 'review','qty','current','improved','stock','availability','user','state','actions'];

  /* @ViewChild("improvementPaginator", { static: false }) set content(paginator: MatPaginator) {
    this.improvementDataSource.paginator = paginator;
  } */

  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  ngAfterViewInit() {
    this.improvementDataSource.paginator =this.paginator;
  }
  
  constructor() { }

  ngOnInit(): void{}
}


export interface Improvements {
  date: string;
  name: string;
  component:string,
  model:string,
  review:string
  qty:number,
  current:string,
  improved:string,
  stock:number,
  availability:string,
  user: string;
  state: string;
}

const improvements: Improvements[] = [
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  {date: '18/02/2021', name: 'Mejora 1',component:'MOTOR',model:'797F',review:'NO',qty: 1,current:'AA: 1234567',improved:'AA: 5B7686',stock:10,availability:'18/02/2021', user: 'Miguiel Mauriola', state:'Validado'},
  
];
