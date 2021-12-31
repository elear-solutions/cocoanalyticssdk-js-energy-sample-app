import { Component, OnChanges, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, Chart } from 'chart.js';
import { Label } from 'ng2-charts';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  @Input()
  timeResolution!: string;
  @Input()
  dataset!: { data: string | any[]; };
  @Input()
  graphType!: string;
  showChart: boolean = false;
  title = "";
  ready: boolean = false;

  // public barChartOptions: ChartOptions = {
  //   responsive: true,
  // };

  // Chart.pluginService.register({
  //   beforeDraw: function (chart, easing) {
  //     if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
  //       var helpers = Chart.helpers;
  //       var ctx = chart.chart.ctx;
  //       var chartArea = chart.chartArea;

  //       ctx.save();
  //       ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
  //       ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
  //       ctx.restore();
  //     }
  //   }
  // });

  public barChartOptions: any = {
    responsive: true,
    //  ...this.barChartOptions,
    options: {
      chartArea: {
        backgroundColor: 'rgba(251, 85, 85, 0.4)'
      }
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
          barThickness: 8,  // number (pixels) or 'flex'
        },

      ],
      yAxes: [{
        stacked: true,
        ticks: {
          // callback: function (label, index) {
          //   // Hide the label of every 2nd dataset
          //   // return index % 2 === 0 ? this.getLabelForValue(label) : '';
          //   // return index % 2 === 0 ? label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

          //   // return index % 2 === 0 ? 'aaa' : 'bbb';
          // },

          callback: function (label: { toString: () => string; }, index: any, labels: any) {
            // return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " kWh";
            return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "";
          }
        },
      }]
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
    { data: [], label: '' },
  ];

  constructor() { }

  ngOnChanges(): void {
    this.barChartType = this.graphType;
    this.barChartLabels = [];
    this.barChartColors = [];

    console.log("in chart ");
    console.log(this.dataset);
    if (this.dataset && this.dataset.data) {

      if (this.graphType == "bar") {
        this.setBarChartColors();
      }
      else {
        this.setBarChartColors2();
      }


      // this.barChartData[0].label=this.selectedResource.name;
      for (var i = 0; i < this.dataset.data.length; i++) {

        this.barChartData[0].data.push(
          this.dataset.data[i].value
        );

        if (this.timeResolution == "Hourly") {
          this.getTimes(this.dataset.data[i].time, i);
        }

        else if (this.timeResolution == "Daily") {
          this.getDays(this.dataset.data[i].time, i);
        }
        else if (this.timeResolution == "Monthly") {
          this.getMonths(this.dataset.data[i].time, i);
        }
      }
      this.showChart = true;
    }
  }

  configureCharts() {


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
    if (i % 2 === 0) {
      this.barChartLabels.push(months[d.getMonth()] + ' ' + d.getDate().toString());
    }
    else {
      this.barChartLabels.push("");
    }
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

  setBarChartColors() {
    this.barChartColors = [];
    var color = [];
    // for(var i=0; i< this.dataset.data.length; i++){
    for (var j = 0; j < this.dataset.data.length; j++) {
      if (parseInt(this.dataset.data[j]) > this.alertThreshold) {
        color.push('#E27373');
      }
      else {
        color.push('#66a19c');
      }
    }
    // }
    this.barChartColors.push({ backgroundColor: color })
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
      }
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
