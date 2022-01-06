import { Component, OnChanges, Input } from '@angular/core';
import { Label } from 'ng2-charts';
import { ChartType } from 'chart.js';
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
  title!: string;

  showChart: boolean = false;
  alertThreshold = 3500;

  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,

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
  public chartLabels: Label[] = [];
  public chartLegend = true;
  public chartPlugins: any[] = [];
  public chartColors: any[] = [];
  public chartData: any[] = [
    { data: [], label: '' },
  ];

  constructor() { }

  ngOnChanges(): void {
    this.chartLabels = [];
    this.chartColors = [];
    this.chartData = [
      { data: [], label: '' },
    ];

    if (this.dataset && this.dataset.data) {
      this.setChartColors();

      for (var i = 0; i < this.dataset.data.length; i++) {
        this.chartData[0].data.push(
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

  setChartColors() {
    this.chartColors = [];
    var color = [];
    for (var j = 0; j < this.dataset.data.length; j++) {
      if (parseInt(this.dataset.data[j]) > this.alertThreshold) {
        color.push('#E27373');
      }
      else {
        color.push('#66a19c');
      }
    }
    this.chartColors.push({ backgroundColor: color })
  }

  getTimes(dateTime: any, i: number) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = this.convertUTCDateToLocalDate(dateTime);
    var hours = parseInt(d.getHours().toString()) < 10 ? "0" + d.getHours().toString() : d.getHours().toString();
    var mins = parseInt(d.getMinutes().toString()) < 10 ? "0" + d.getMinutes().toString() : d.getMinutes().toString();
    var time = (hours + ":" + mins);


    this.convertMilitaryTimeToStandardTime(time).then((res: any) => {
      if (i % 2 === 0) {
        this.chartLabels.push([res, d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear().toString()]);
      }
      else {
        this.chartLabels.push("");
      }
    });
  }

  getDays(dateTime: any, i: number) {
    var d = this.convertUTCDateToLocalDate(dateTime);
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (i % 2 === 0) {
      this.chartLabels.push(months[d.getMonth()] + ' ' + d.getDate().toString());
    }
    else {
      this.chartLabels.push("");
    }
  }

  getMonths(dateTime: any, i: number) {
    var d = this.convertUTCDateToLocalDate(dateTime);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (i % 2 === 0) {
      this.chartLabels.push([months[d.getMonth()], d.getFullYear().toString()]);
    }
    else {
      this.chartLabels.push("");
    }
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
