import { Component, OnChanges, Input } from '@angular/core';
import { Label } from 'ng2-charts';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnChanges {
  @Input()
  timeResolution!: string;
  @Input()
  dataset: any = [];
  @Input()
  title!: string;
  @Input()
  mode!: string;

  showChart: boolean = false;

  ready: boolean = false;

  public barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    options: {
      scales: {
        gridLines: { display: false, color: "#333333" },
        xAxes: [
          {
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
            stacked: true,
            ticks: {
              maxTicksLimit: 0,
              maxRotation: 0,
            },
          },

        ],
        yAxes: [{
          gridLines: {
            drawOnChartArea: false
          },
          stacked: true,
          ticks: {
            callback: function (label: { toString: () => string; }, index: any, labels: any) {
              return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "";
            },
          },
        }]
      },
    },
    legend: {
      display: false
    }
  };

  public barChartLabels: Label[] = [];
  public barChartType!: any;
  public barChartLegend = true;
  public barChartPlugins: any[] = [];
  public barChartColors: any[] = [];
  alertThreshold = 3500;

  public barChartData: any[] = [
    {
      data: [], label: '', fill: false, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    },
    {
      data: [], label: '', fill: false, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }
  ];
  constructor() { }

  ngOnChanges(): void {
    this.barChartLabels = [];
    this.barChartColors = [];
    this.barChartData = [
      {
        data: [], label: '', fill: false, backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      },

      {
        data: [], label: '', fill: false, backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }];
    var k = 1;

    if (this.dataset) {
      while (k <= 31) {
        this.barChartLabels.push(k.toString());
        k++;
      }

      for (var i = 0; i < this.dataset.length; i++) {
        for (var j = 0; j < this.dataset[i].data?.length; j++) {
          if (i == 0) {
            this.barChartData[i].data.push(
              this.dataset[i].data[j].value
            );

            if (this.timeResolution == "Hourly") {
              this.getTimes(this.dataset[i].data[j].time, i);
            }

            else if (this.timeResolution == "Daily") {
              this.getDays(this.dataset[i].data[j].time, i);
            }
            else if (this.timeResolution == "Monthly") {
              this.getMonths(this.dataset[i].data[j].time, i);
            }
          }
          else if (i == 1) {
            this.barChartData[i].data.push(
              this.dataset[i].data[j].value
            );

            if (this.timeResolution == "Hourly") {
              this.getTimes(this.dataset[i].data[j].time, i);
            }

            else if (this.timeResolution == "Daily") {
              this.getDays(this.dataset[i].data[j].time, i);
            }
            else if (this.timeResolution == "Monthly") {
              this.getMonths(this.dataset[i].data[j].time, i);
            }
          }
        }
      }
      this.setChartColors();
    }
  }

  getTimes(dateTime: any, i: number) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = Utils.convertUTCDateToLocalDate(dateTime);
    var hours = parseInt(d.getHours().toString()) < 10 ? "0" + d.getHours().toString() : d.getHours().toString();
    var mins = parseInt(d.getMinutes().toString()) < 10 ? "0" + d.getMinutes().toString() : d.getMinutes().toString();
    var time = (hours + ":" + mins);

    var res = Utils.convertMilitaryTimeToStandardTime(time);
    if (i % 2 === 0) {
      this.barChartLabels.push([res, d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear().toString()]);
    }
    else {
      this.barChartLabels.push("");
    }
  }

  getDays(dateTime: any, i: number) {
    var d = Utils.convertUTCDateToLocalDate(dateTime);
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  }

  getMonths(dateTime: any, i: number) {
    var d = Utils.convertUTCDateToLocalDate(dateTime);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (i % 2 === 0) {
      this.barChartLabels.push([months[d.getMonth()], d.getFullYear().toString()]);
    }
    else {
      this.barChartLabels.push("");
    }
  }

  setChartColors() {
    this.barChartColors = [
      {//green
        borderColor: '#66A19C',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#66A19C',
        pointHoverBackgroundColor: '#fff',
        color: '#fff'
      },
      { //yellow
        borderColor: '#F6B72B',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#F6B72B',
        pointHoverBackgroundColor: '#fff',
        color: '#fff'
      },
    ];
    if (this.mode == "endMonth") {
      this.showChart = true;
    }
    else if (this.mode == "endMonth") {
      this.showChart = false;
    }
  }
}
