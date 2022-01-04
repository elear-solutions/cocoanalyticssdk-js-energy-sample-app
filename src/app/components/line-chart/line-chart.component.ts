import { Component, OnChanges, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, Chart } from 'chart.js';
import { Label } from 'ng2-charts';

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
  graphType!: string;
  showChart: boolean = false;
  title = "";
  ready: boolean = false;

  // public barChartOptions: any = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   type: 'line',
  //   // data: data,
  //   options: {
  //     chartArea: {
  //       // backgroundColor: 'rgba(251, 85, 85, 0.4)'
  //       backgroundColor: 'rgba(0,0,0)'
  //     },
  //     // responsive: true,
  //     // maintainAspectRatio: false,
  //     interaction: {
  //       mode: 'index',
  //       intersect: false,
  //     },
  //     stacked: false,
  //     plugins: {
  //       title: {
  //         display: true,
  //         text: 'Chart.js Line Chart - Multi Axis'
  //       }
  //     },
  //     scales: {
  //       xAxes: [
  //         {
  //           stacked: true,
  //           ticks: {
  //             maxTicksLimit: 0,
  //             maxRotation: 0,
  //           },
  //           gridLines: { display: false, color: "#FFFFFF" },
  //           barThickness: 8,  // number (pixels) or 'flex'
  //         },

  //       ],
  //       yAxes: [{
  //         stacked: true,
  //         ticks: {
  //           // callback: function (label, index) {
  //           //   // Hide the label of every 2nd dataset
  //           //   // return index % 2 === 0 ? this.getLabelForValue(label) : '';
  //           //   // return index % 2 === 0 ? label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

  //           //   // return index % 2 === 0 ? 'aaa' : 'bbb';
  //           // },

  //           callback: function (label: { toString: () => string; }, index: any, labels: any) {
  //             // return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " kWh";
  //             return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "";
  //           }
  //         },
  //       }],
  //       //   y: {
  //       //     type: 'linear',
  //       //     display: true,
  //       //     position: 'left',
  //       //     gridLines: { display: false, color: "#FFFFFF" },

  //       //   },
  //       //   y1: {
  //       //     type: 'linear',
  //       //     display: true,
  //       //     position: 'right',
  //       //     gridLines: { display: false, color: "#FFFFFF" },


  //       //     // // grid line settings
  //       //     // grid: {
  //       //     //   drawOnChartArea: false, // only want the grid lines for one axis to show up
  //       //     // },
  //       //   },
  //       // },
  //       // legend: {
  //       //   display: false
  //       // }
  //     }
  //   }
  // }

  public barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    //  ...this.barChartOptions,
    options: {
      chartArea: {
        backgroundColor: 'rgba(251, 85, 85, 0.4)'
        // backgroundColor: 'rgba(0,0,0)'
      },
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              maxTicksLimit: 0,
              maxRotation: 0,
            },
            gridLines: { display: false, color: "#FFFFFF" },
          },

        ],
        yAxes: [{
          stacked: true,
          ticks: {
            callback: function (label: { toString: () => string; }, index: any, labels: any) {
              // return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " kWh";
              return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "";
            },
            gridLines: { display: false, color: "#FFFFFF" },
          },
        }]
      },
      legend: {
        display: false
      }
    }
  };

  public barChartLabels: Label[] = [];
  public barChartType!: any;
  public barChartLegend = true;
  public barChartPlugins: any[] = [];
  public barChartColors: any[] = [];
  alertThreshold = 3500;

  public barChartData: any[] = [
    { data: [], label: '' },
    { data: [], label: '' }
  ];
  // barChartData: ChartDataSets[] = [
  //   { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' },
  //   { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
  // ];

  constructor() { }

  ngOnChanges(): void {
    this.barChartType = this.graphType;
    this.barChartLabels = [];
    this.barChartColors = [];
    var k = 1;

    if (this.dataset) {
      while (k <= 31) {
        this.barChartLabels.push(k.toString());
        k++;
      }


      for (var i = 0; i < this.dataset.length; i++) {
        // this.barChartData[0].label=this.selectedResource.name;
        for (var j = 0; j < this.dataset[i].data.length; j++) {
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

        this.showChart = true;
        this.ready = true;
      }
      this.setBarChartColors2();
    }
  }

  getTimes(dateTime: any, i: number) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = this.convertUTCDateToLocalDate(dateTime);
    var hours = parseInt(d.getHours().toString()) < 10 ? "0" + d.getHours().toString() : d.getHours().toString();
    var mins = parseInt(d.getMinutes().toString()) < 10 ? "0" + d.getMinutes().toString() : d.getMinutes().toString();
    var time = (hours + ":" + mins);

    this.convertMilitaryTimeToStandardTime(time).then((res: any) => {
      if (i % 2 === 0) {
        this.barChartLabels.push([res, d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear().toString()]);
      }
      else {

        this.barChartLabels.push("");
      }
    });
  }

  getDays(dateTime: any, i: number) {
    var d = this.convertUTCDateToLocalDate(dateTime);
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // this.barChartLabels.push(months[d.getMonth()] + ' ' + d.getDate().toString());
    // this.barChartLabels.push(months[d.getMonth()] + ' ' + d.getDate().toString());

    // if (i % 2 === 0) {
    //   this.barChartLabels.push(months[d.getMonth()] + ' ' + d.getDate().toString());
    // }
    // else {
    //   this.barChartLabels.push("");
    // }
  }

  getMonths(dateTime: any, i: number) {
    var d = this.convertUTCDateToLocalDate(dateTime);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (i % 2 === 0) {
      this.barChartLabels.push([months[d.getMonth()], d.getFullYear().toString()]);
    }
    else {
      this.barChartLabels.push("");
    }
  }

  setBarChartColors2() {
    this.barChartColors = [
      {//green
        // backgroundColor: '#fff',
        borderColor: '#66A19C',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#66A19C',
        pointHoverBackgroundColor: '#fff',
        color: '#fff'
        // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      { //yellow
        // backgroundColor: '#fff',
        borderColor: '#F6B72B',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#F6B72B',
        pointHoverBackgroundColor: '#fff',
        color: '#fff'
        // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
    ];

  }

  convertUTCDateToLocalDate(date: string | number | Date) {
    var d = new Date(date);
    var time = d.getTime();
    var offset = d.getTimezoneOffset() * 60 * 1000;
    var nd = time - offset;
    var newDate = new Date(nd);
    return newDate;
  }

  async convertMilitaryTimeToStandardTime(time: string) {
    var splitTime = time.split(':');
    var _hrs = splitTime[0];
    var _mins = splitTime[1];

    if (parseInt(_hrs) > 12) {
      _hrs = (parseInt(_hrs) - 12).toString();
      if (parseInt(_hrs) < 10) {
        // _hrs=("0"+_hrs).toString();
      }
      return _hrs + ":" + _mins + " pm";
    }
    else if (parseInt(_hrs) < 12 && parseInt(_hrs) != 0) {
      if (parseInt(_hrs) < 10) {
        // _hrs=("0"+_hrs).toString();
      }
      return _hrs + ":" + _mins + " am";
    }
    else if (parseInt(_hrs) == 12) {
      return "12:00 pm";
    }
    else if (parseInt(_hrs) == 0) {
      return "12:00 am";
    }
    else {
      return "";
    }
  }
}
