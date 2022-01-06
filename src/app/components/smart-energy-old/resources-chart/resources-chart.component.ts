import { Component, OnInit, Input } from "@angular/core";
import { CubejsClient } from '@cubejs-client/ngx';
import { Subject } from "rxjs";
import * as moment from "moment";
import { ComposerService } from "src/app/services/composer.service";
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, filter, distinctUntilChanged, pairwise, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-resources-chart',
  templateUrl: './resources-chart.component.html',
  styleUrls: ['./resources-chart.component.scss']
})

export class ResourcesChartComponent implements OnInit {
  @Input() chartType;
  @Input() query;
  @Input() timePeriod;
  @Input() title;

  public chartData;
  public chartLabels: any = [];
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };
  public chartColors;
  private querySubject;
  ready = false;
  showChart = false;
  data: any = "";
  public barChartColors: any[] = [];
  private dateFormatter = ({ x }) => moment(x).format("MMM DD");
  private numberFormatter = x => x.toLocaleString();
  private capitalize = ([first, ...rest]) =>
    first.toUpperCase() + rest.join("").toLowerCase();


  constructor(private cubejs: CubejsClient, private composerService: ComposerService, private router: Router) {
    this.querySubject = new Subject();
    this.composerService.getIndividualResourceSubscriptionDetails().subscribe(data => {

      this.query = data.obj;

      if (this.query != undefined) {
        this.ready = false;
        this.showChart = false;
        this.resultChanged = this.resultChanged.bind(this);

        this.cubejs
          .watch(this.querySubject)
          .subscribe(this.resultChanged, err => console.log("HTTP Error", err));
        this.querySubject.next(this.query);
      }
    });

  }

  ngOnInit() {
  }



  resultChanged(resultSet) {
    this.data = resultSet.chartPivot();
    //     console.log(resultSet.chartPivot()[0].x);
    //     console.log(resultSet.seriesNames()[0]);

    this.commonSetup(resultSet);
    if (this.chartType == "bar") {
      this.setTotalHomeConsumptionData();
    }
  }
  convertUTCDateToLocalDate(date) {
    var d = new Date(date);
    var time = d.getTime();
    var offset = d.getTimezoneOffset() * 60 * 1000;
    var nd = time - offset;

    var newDate = new Date(nd);
    return newDate;
  }

  commonSetup(resultSet) {
    this.chartLabels = [];
    resultSet.chartPivot().map(item => {
      var d = this.convertUTCDateToLocalDate(item.x);
      var hours = parseInt(d.getHours().toString()) < 10 ? "0" + d.getHours().toString() : d.getHours().toString();
      var mins = parseInt(d.getMinutes().toString()) < 10 ? "0" + d.getMinutes().toString() : d.getMinutes().toString();
      var time = (hours + ":" + mins);
      if (this.timePeriod == 'Hourly') {
        this.convertMilitaryTimeToStandardTime(time).then(res => {
          this.chartLabels.push(res);
        });
      }
      else if (this.timePeriod == "Daily") {
        var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.chartLabels.push(months[d.getMonth()] + ' ' + d.getDate());
      }
      else if (this.timePeriod == "Monthly") {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.chartLabels.push(months[d.getMonth()]);
      }
    });
    this.chartData = resultSet.seriesNames().map(({ key, title }) => ({
      data: resultSet.chartPivot().map((element) => parseFloat(element[key]).toFixed(2)),
      label: "Avg Energy Consumption"
    }));
    var x = [];
    this.barChartColors = [];

    for (var i = 0; i < this.chartData.length; i++) {

      for (var j = 0; j < this.chartData[i].data.length; j++) {

        if (parseInt(this.chartData[i].data[j]) > 10600) {
          x.push('#E27373');
        }
        else {
          x.push('#66a19c');
        }
      }
    }
    this.barChartColors.push({ backgroundColor: x })
  }

  setTotalHomeConsumptionData() {
    this.chartType = "bar";
    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              maxTicksLimit: 0,
              maxRotation: 0,

            },
            gridLines: { display: false },
            barThickness: 8,  // number (pixels) or 'flex'
            // maxBarThickness: 8 // number (pixels)
          }
        ],
        yAxes: [{
          stacked: true,
          ticks: {
            callback: function (label, index, labels) {
              return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " kWh";
            }
          },
        }]
      },
      legend: {
        display: false
      }
    };
    this.ready = true;
    this.showChart = true;
  }

  async convertMilitaryTimeToStandardTime(time) {
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
  }
}
