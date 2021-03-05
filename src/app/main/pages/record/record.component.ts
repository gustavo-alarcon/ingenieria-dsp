import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Evaluation } from '../../models/evaluations.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  searchForm: FormGroup;

  historyDataSource = new MatTableDataSource<Record>();
  historyDisplayedColumns: string[] = [
    'reportDate',
    'workShop',
    'name',
    'child',
    'problemType',
    'description',
    'atentionTime',
    'user',
    'state',
    'workReturnDate',
    'comments',
    'returnUser',
  ];

  /* @ViewChild('historytPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.historyDataSource.paginator = paginator;
  } */
  @ViewChild("historyPaginator", { static: false }) set content(paginator: MatPaginator) {
    this.historyDataSource.paginator = paginator;
  }
  data: Record[] = [
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Retomado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Parado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Retomado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Parado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Retomado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Retomado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Parado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Parado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Retomado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Parado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
      {reportDate: '18/02/2021', workShop: 'CRC Lima', name: 'Bahia 1', child: 850013192, problemType: 'Seguridad', description: 'Descripcion', atentionTime: '01:00:12', user: 'Juan Perez', state: 'Retomado', workReturnDate: '03/03/2021', comments: 'Comentarios', returnUser: 'Juan Perez'},
    ];

  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {
    
    this.searchForm = this.fb.group({
      search: ['', Validators.required],
    });

    this.historyDataSource.data = this.data;

  }

  editDialog(): void{

  }

  deleteDialog(): void{

  }
  download(){
    
  }

}


export interface Record{
  reportDate: string;
  workShop: string;
  name: string;
  child: number;
  problemType: string;
  description: string;
  atentionTime: string;
  user: string;
  state: string;
  workReturnDate: string;
  comments: string;
  returnUser: string;
}