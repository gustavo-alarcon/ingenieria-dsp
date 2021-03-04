import { Component, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { FormGroup, FormControl } from '@angular/forms';
import { EvaluationsService } from '../../services/evaluations.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  dateForm: FormGroup;

  constructor(private dbs: EvaluationsService) {}

  ngOnInit(): void {
    const view = this.dbs.getCurrentMonthOfViewDate();

    const beginDate = view.from;
    const endDate = new Date();
    endDate.setHours(23, 59, 59);

    this.dateForm = new FormGroup({
      start: new FormControl(beginDate),
      end: new FormControl(endDate)
    });

    const nameProductMax = [
      'Seguridad',
      'Insumos',
      'Calidad',
      'Maquinas',
      'Administrativo',
      'Soporte',
    ];
    const colors = [
      '#F2C94C',
      '#F2994A',
      '#FF2D2D',
      'rgba(98, 0, 238, 0.24)',
      '#27AE60',
      '#018786',
    ];
    let stockProductMax = [2, 3, 4, 5, 6, 3];

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
      type: 'bar',
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
          text: 'answer',
        },
        scales: {
          yAxes: [
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
