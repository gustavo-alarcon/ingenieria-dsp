import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.scss'],
})
export class EvaluationsComponent implements OnInit {


  title = 'angular-material-tab-router';
  navLinks: any[];
  activeLinkIndex = -1;
  constructor(private router: Router) {
    this.navLinks = [
      {
        label: 'SOLICITUDES',
        link: './request',
        index: 0
      }, {
        label: 'EN PROCESO',
        link: './progress',
        index: 1
      }, {
        label: 'RESULTADOS',
        link: './history',
        index: 2
      }, {
        label: 'CONFIGURACIONES',
        link: './settings',
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
