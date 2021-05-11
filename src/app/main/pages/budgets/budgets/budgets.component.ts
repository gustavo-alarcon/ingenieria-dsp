import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
})
export class BudgetsComponent implements OnInit {
  constructor(private router: Router) {}

  public activeLinkIndex = -1;

  public navLinks: Array<any> = [
    {
      label: 'RESUMEN',
      link: './summary',
      index: 0,
    },
    {
      label: 'PENDIENTES DE ENVÍO',
      link: './pending-send',
      index: 1,
    },
    {
      label: 'PENDIENTES DE APROBACIÓN',
      link: './pending-approval',
      index: 2,
    },
  ];

  public ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.find((tab) => tab.link === '.' + this.router.url)
      );
    });
  }
}
