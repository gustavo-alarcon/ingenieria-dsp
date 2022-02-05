import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EvaluationsService } from '../../../services/evaluations.service';
import { Router } from '@angular/router';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { Andon } from '../../../models/andon.model';
import { tap, startWith, map } from 'rxjs/operators';
import { AndonService } from 'src/app/main/services/andon.service';
import { Chart } from 'node_modules/chart.js';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  state = 'retaken';
  stateStop = 'stopped';

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
    //console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent; active: {}[] }): void {
    //console.log(event, active);
  }

  dateForm: FormGroup;

  andon$: Observable<Andon[]>;
  andonGroupBy$: Observable<any[]>;
  andonAverageQuestions$: Observable<Andon[]>;
  topDelay$: Observable<any>;
  chart: any = [];

  subscriptions = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    private dbs: EvaluationsService,
    public router: Router,
    private andonService: AndonService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.breakpoint
        .observe([Breakpoints.HandsetPortrait])
        .subscribe((res) => {
          if (res.matches) {
            this.isMobile = true;
          } else {
            this.isMobile = false;
          }
        })
    );

    const view = this.andonService.getCurrentTimeFrame();

    const beginDate = view.from;
    const endDate = new Date();
    endDate.setHours(23, 59, 59);

    this.dateForm = new FormGroup({
      start: new FormControl(beginDate),
      end: new FormControl(endDate),
    });

    this.andon$ = combineLatest(
      this.andonService.getAllAndon(),
      this.dateForm.get('start').valueChanges.pipe(
        startWith(beginDate),
        map((begin) => begin.setHours(0, 0, 0, 0))
      ),
      this.dateForm.get('end').valueChanges.pipe(
        startWith(endDate),
        map((end) => (end ? end.setHours(23, 59, 59) : null))
      )
    ).pipe(
      map(([andons, startdate, enddate]) => {
        const date = { begin: startdate, end: enddate };

        let preFilterSearch: Andon[] = [...andons];
        preFilterSearch = andons.filter((andon) => {
          return this.getFilterTime(andon.reportDate, date);
        });

        return preFilterSearch;
      }),
      tap((res) => {
        this.reportProblemType(res);
      })
    );

    this.topDelay$ = combineLatest(
      this.andonService.getAndonRetaken(this.state),
      this.dateForm.get('start').valueChanges.pipe(
        startWith(beginDate),
        map((begin) => begin.setHours(0, 0, 0, 0))
      ),
      this.dateForm.get('end').valueChanges.pipe(
        startWith(endDate),
        map((end) => (end ? end.setHours(23, 59, 59) : null))
      )
    ).pipe(
      map(([andons, startdate, enddate]) => {
        const date = { begin: startdate, end: enddate };

        let preFilterSearch: Andon[] = [...andons];
        preFilterSearch = andons.filter((andon) => {
          return this.getFilterTime(andon.reportDate, date);
        });

        let result;
        let sumTimer;

        result = preFilterSearch.reduce((groups, item) => {
          const val = item.otChild;
          groups[val] = groups[val] || {
            otChild: item.otChild,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            quatity: 0,
          };
          groups[val].days += item.atentionTime.days;
          groups[val].hours += item.atentionTime.hours;
          groups[val].minutes += item.atentionTime.minutes;
          groups[val].seconds += item.atentionTime.seconds;
          groups[val].quatity += 1;
          return groups;
        }, {});
        sumTimer = Object.values(result);

        let result1;
        let reportJoinTimer;

        result1 = sumTimer.reduce((groups, item) => {
          const val = item.otChild;
          groups[val] = groups[val] || {
            otChild: item.otChild,
            timer: 0,
            date: '',
          };
          groups[val].timer =
            (item.days +
              item.hours / 24 +
              item.minutes / 60 / 24 +
              item.seconds / 60 / 60 / 24) /
            item.quatity;
          groups[val].date = `${
            item.days +
            '/' +
            item.hours +
            ':' +
            item.minutes +
            ':' +
            item.seconds
          }`;

          return groups;
        }, {});
        reportJoinTimer = Object.values(result1);

        reportJoinTimer.sort((a, b) => b.timer - a.timer);

        const top = reportJoinTimer.slice(0, 10);
        const firts = top.slice(0, 5);
        const second = top.slice(5, 10);

        const topTen = {
          firts: firts,
          second: second,
        };

        return topTen;
      })
    );

    this.andonGroupBy$ = combineLatest(
      this.andonService.getAndonStopped(this.stateStop),
      this.dateForm.get('start').valueChanges.pipe(
        startWith(beginDate),
        map((begin) => begin.setHours(0, 0, 0, 0))
      ),
      this.dateForm.get('end').valueChanges.pipe(
        startWith(endDate),
        map((end) => (end ? end.setHours(23, 59, 59) : null))
      )
    ).pipe(
      map(([andons, startdate, enddate]) => {
        const date = { begin: startdate, end: enddate };
        const groupByWorkShop = [];

        let preFilterSearch: Andon[] = [...andons];
        preFilterSearch = andons.filter((andon) => {
          return this.getFilterTime(andon.reportDate, date);
        });

        preFilterSearch.reduce((res, value) => {
          if (!res[value.workShop]) {
            res[value.workShop] = { workShop: value.workShop, quantity: 0 };
            groupByWorkShop.push(res[value.workShop]);
          }
          res[value.workShop].quantity += 1;
          return res;
        }, {});
        return groupByWorkShop;
      })
    );

    this.andonAverageQuestions$ = combineLatest(
      this.andonService.getAndonRetaken(this.state),
      this.dateForm.get('start').valueChanges.pipe(
        startWith(beginDate),
        map((begin) => begin.setHours(0, 0, 0, 0))
      ),
      this.dateForm.get('end').valueChanges.pipe(
        startWith(endDate),
        map((end) => (end ? end.setHours(23, 59, 59) : null))
      )
    ).pipe(
      map(([andons, startdate, enddate]) => {
        const date = { begin: startdate, end: enddate };

        let preFilterSearch: Andon[] = [...andons];
        preFilterSearch = andons.filter((andon) => {
          return this.getFilterTime(andon.reportDate, date);
        });

        const reportTypeQuestions = [];

        andons.reduce((res, value) => {
          if (!res[value.problemType]) {
            res[value.problemType] = {
              problemType: value.problemType,
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
              quatity: 0,
            };
            reportTypeQuestions.push(res[value.problemType]);
          }
          res[value.problemType].days += value.atentionTime.days;
          res[value.problemType].hours += value.atentionTime.hours;
          res[value.problemType].minutes += value.atentionTime.minutes;
          res[value.problemType].seconds += value.atentionTime.seconds;
          res[value.problemType].quatity += 1;

          return res;
        }, {});

        let result;
        let sumTimer;

        result = preFilterSearch.reduce((groups, item) => {
          const val = item.problemType;
          groups[val] = groups[val] || {
            problemType: item.problemType,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            quatity: 0,
          };
          groups[val].days += item.atentionTime.days;
          groups[val].hours += item.atentionTime.hours;
          groups[val].minutes += item.atentionTime.minutes;
          groups[val].seconds += item.atentionTime.seconds;
          groups[val].quatity += 1;
          return groups;
        }, {});
        sumTimer = Object.values(result);

        let result1;
        let reportJoinTimer;

        result1 = sumTimer.reduce((groups, item) => {
          const val = item.problemType;
          groups[val] = groups[val] || {
            problemType: item.problemType,
            timer: 0,
          };
          groups[val].timer =
            (item.days +
              item.hours / 24 +
              item.minutes / 60 / 24 +
              item.seconds / 60 / 60 / 24) /
            item.quatity;
          return groups;
        }, {});
        reportJoinTimer = Object.values(result1);
        return reportJoinTimer;
      }),
      tap((res) => {
        this.averageQuestions(res);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getFilterTime(el, time): any {
    const date = el.toMillis();
    const begin = time.begin;
    const end = time.end;
    return date >= begin && date <= end;
  }

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

    this.lineChartData = [{ data: quantityProblem, label: 'Tipo de problema' }];

    this.lineChartLabels = nameProblemType;

    this.lineChartOptions = {
      responsive: true,
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        yAxes: [],
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

  averageQuestions(reportJoinTimer): void {
    const nameProblemType = [];
    const averageTime = [];

    reportJoinTimer.map((res) => {
      nameProblemType.push(res.problemType);
      averageTime.push(res.timer.toFixed(2));
    });

    this.lineChartData2 = [
      { data: averageTime, label: 'Promedio tiempo de respuesta por dia' },
    ];

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
