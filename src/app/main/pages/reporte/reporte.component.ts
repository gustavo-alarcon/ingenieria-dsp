import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  reportForm: FormGroup;

  typeProblem = [
    {name: 'Seguridad'},
    {name: 'Insumos'},
    {name: 'Calidad'},
    {name: 'Maquinas'},
    {name: 'Administrativo'},
    {name: 'Soporte'},
  ];






  constructor(
    private fb: FormBuilder,
    public router: Router,


  ) { }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      typeProblem: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }
  
  save(): void{

    if (!this.reportForm.invalid){
      this.router.navigate(['main/andon-reports']);
    }

  }

}
