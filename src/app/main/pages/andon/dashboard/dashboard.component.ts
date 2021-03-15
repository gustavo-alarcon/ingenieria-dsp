import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EvaluationsService } from '../../../services/evaluations.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Andon } from '../../../models/andon.model';
import { tap } from 'rxjs/operators';
import { AndonService } from 'src/app/main/services/andon.service';
import { Chart } from 'node_modules/chart.js';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // Array of different segments in chart
  lineChartData: ChartDataSets[] = [];
  //Labels shown on the x-axis
  lineChartLabels: Label[] = [];
  // Define chart options
  lineChartOptions: ChartOptions = {};
  // Define colors of chart segments
  lineChartType;

  // Array of different segments in chart
  lineChartData2: ChartDataSets[] = [];
  //Labels shown on the x-axis
  lineChartLabels2: Label[] = [];
  // Define chart options
  lineChartOptions2: ChartOptions = {};
  // Define colors of chart segments
  lineChartType2;

  colors = [
    '#F2C94C',
    '#F2994A',
    '#FF2D2D',
    'rgba(98, 0, 238, 0.24)',
    '#27AE60',
    '#018786',
  ];

  lineChartColors: Color[] = [
    {
      backgroundColor: this.colors,
      borderColor: this.colors,
    },
  ];

  // Set true to show legends
  lineChartLegend = true;
  // Define type of chart
  lineChartPlugins = [];

  // events
  chartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
  }

  dateForm: FormGroup;

  andon$: Observable<Andon[]>;
  chart: any = [];
  groupByWorkShop = [];

  constructor(
    private dbs: EvaluationsService,
    public router: Router,
    private andonService: AndonService
  ) {}

  ngOnInit(): void {
    const view = this.dbs.getCurrentMonthOfViewDate();

    const beginDate = view.from;
    const endDate = new Date();
    endDate.setHours(23, 59, 59);

    this.dateForm = new FormGroup({
      start: new FormControl(beginDate),
      end: new FormControl(endDate),
    });

    /*    const nameProductMax = [
      'Seguridad',
      'Insumos',
      'Calidad',
      'Maquinas',
      'Administrativo',
      'Soporte'
    ];
    const colors = [
      '#F2C94C',
      '#F2994A',
      '#FF2D2D',
      'rgba(98, 0, 238, 0.24)',
      '#27AE60',
      '#018786'
    ];

    //['#F2C94C','#F2994A','#FF2D2D','rgba(98, 0, 238, 0.24)','#27AE60','#018786'],
    const stockProductMax = [2,3,4,5,6,3];

    new Chart(document.getElementById("problem"),{
      type: 'horizontalBar',
      data: {
        labels: ['Seguridad','Insumos','Calidad','Maquinas','Administrativo','Soporte'],
        datasets: [
          {
            label: "mas vendido",
            backgroundColor:['#F2C94C','#F2994A','#FF2D2D','#27AE60','#27AE60','#018786'],
            data: [2,3,4,5,6,3],
            fill:false,
          }
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: '% de ventas'
        },
        scales: {
          xAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
        }
      }
    }) */

    this.andon$ = this.andonService.getAllAndon().pipe(
      tap((res: Andon[]) => {
        let andonArray: Andon[] = [];
        andonArray = res;

        andonArray.reduce((res, value) => {
          if (!res[value.workShop]) {
            res[value.workShop] = { workShop: value.workShop, quantity: 0 };
            this.groupByWorkShop.push(res[value.workShop]);
          }
          res[value.workShop].quantity += 1;
          return res;
        }, {});

        this.reportProblemType(andonArray);
        this.averageQuestions(andonArray);

        /*  const nameProductMax = [
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
                label: 'mas vendido',
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
              text: '% de ventas',
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
        }); */
      })
    );
  }
  topTenDelayed(): void {}

  reportProblemType(andonArray: any): void {
    const nameProblemType = [];
    const quantityProblem = [];

    // report for type problem
    const reportTypeProblem = [];

    andonArray.reduce((res, value) => {
      if (!res[value.problemType]) {
        res[value.problemType] = {
          problemType: value.problemType,
          quantity: 0,
        };
        reportTypeProblem.push(res[value.problemType]);
      }
      res[value.problemType].quantity += 1;

      return res;
    }, {});

    reportTypeProblem.map((res) => {
      nameProblemType.push(res.problemType);
      quantityProblem.push(res.quantity);
    });

    this.lineChartData = [{ data: quantityProblem, label: 'prueba' }];

    this.lineChartLabels = nameProblemType;

    this.lineChartOptions = {
      responsive: true,
      scales: {
        xAxes: [{}],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        },
      },
    };

    this.lineChartType = 'horizontalBar';
  }

  averageQuestions(andonArray: any): void {
    const nameProblemType = [];
    const quantityProblem = [];

    console.log('andonArray: ', andonArray);

    this.lineChartData2 = [{ data: quantityProblem, label: 'prueba' }];

    this.lineChartLabels2 = nameProblemType;

    this.lineChartOptions2 = {
      responsive: true,
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        yAxes: [{}],
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        },
      },
    };

    this.lineChartType2 = 'bar';
  }

  reports(item): void {
    const code = item.workShop;
    this.router.navigate(['main/andon-reports/', code]);
  }
}
