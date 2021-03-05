import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public router: Router,

  ) { }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      name: ['', Validators.required],
      child: ['', Validators.required]
    });
  }

  report(): void{

    if (!this.reportForm.invalid){
      this.router.navigate(['main/reporte']);
    }
    
  }

}
