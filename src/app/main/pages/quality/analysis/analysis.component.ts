import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  title = 'angular-material-tab-router';
  navLinks: any[];
  activeLinkIndex = -1;
  constructor(private router: Router) {
    this.navLinks = [
      {
        label: 'REGISTROS',
        link: './records',
        index: 0  
      }, {
        label: 'EN PROCESO',
        link: './progress',
        index: 1
      }, {
        label: 'SEGUIMIENTO',
        link: './tracing',
        index: 2
      }, {
        label: 'RESULTADOS',
        link: './results',
        index: 3
      },
    ];
  }
  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

}
