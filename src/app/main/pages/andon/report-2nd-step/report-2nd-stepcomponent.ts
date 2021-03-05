import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-2nd-step',
  templateUrl: './report-2nd-step.component.html',
  styleUrls: ['./report-2nd-step.component.scss']
})
export class report2ndStepComponent implements OnInit {
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
