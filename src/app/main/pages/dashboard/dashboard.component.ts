import { Component, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    let nameProductMax = [
      'Seguridad',
      'Insumos',
      'Calidad',
      'Maquinas',
      'Administrativo',
      'Soporte',
    ];
    let colors = [
      '#F2C94C',
      '#F2994A',
      '#FF2D2D',
      'rgba(98, 0, 238, 0.24)',
      '#27AE60',
      '#018786',
    ];
    let stockProductMax = [2, 3, 4, 5, 6, 2];

    new Chart(document.getElementById('problem'), {
      type: 'horizontalBar',
      data: {
        labels: nameProductMax,
        datasets: [
          {
            label: '%',
            backgroundColor: colors,
            data: stockProductMax,
            fill: false,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'incidencia',
        },
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    new Chart(document.getElementById('answer'), {
      type: 'verticalBar',
      data: {
        labels: nameProductMax,
        datasets: [
          {
            label: '%',
            backgroundColor: colors,
            data: stockProductMax,
            fill: false,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'incidencia',
        },
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
}
