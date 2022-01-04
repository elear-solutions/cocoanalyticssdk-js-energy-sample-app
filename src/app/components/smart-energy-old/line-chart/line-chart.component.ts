import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CubejsClient } from "@cubejs-client/ngx";
import { Subject } from "rxjs";
import * as moment from "moment";
import { ComposerService } from "src/app/services/composer.service";
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, filter, distinctUntilChanged, pairwise, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})

export class LineChartComponent implements OnInit {
  @Input() chartType;
  @Input() query;
  @Input() timePeriod;
  @Input() title;
  @Output() compareDateRange: any = new EventEmitter<string>();

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
  options = [
    // { value: '1', label: 'Jan 2021', firstDay:'2021-01-01' , lastDay:'2021-01-31' },
    // { value: '2', label: 'Feb 2021', firstDay:'2021-02-01' , lastDay:'2021-02-28'  },
    // { value: '3', label: 'Mar 2021', firstDay:'2021-03-01' , lastDay:'2021-03-31'  },
    { value: '3', label: 'Apr 2021', firstDay: '2021-04-01', lastDay: '2021-04-30' },
    { value: '3', label: 'May 2021', firstDay: '2021-05-01', lastDay: '2021-05-31' },
    { value: '3', label: 'Jun 2021', firstDay: '2021-06-01', lastDay: '2021-06-30' },
    { value: '3', label: 'Jul 2021', firstDay: '2021-07-01', lastDay: '2021-07-31' },
    { value: '3', label: 'Aug 2021', firstDay: '2021-08-01', lastDay: '2021-08-31' },
  ];


  public barChartColors: any = [];
  //  { //yellow
  //   backgroundColor: '#F6B72B',
  //   borderColor: '#F6B72B',
  //   pointBackgroundColor: '#fff',
  //   pointBorderColor: '#F6B72B',
  //   pointHoverBackgroundColor: '#fff',
  //   // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  // },
  // {//green
  //   backgroundColor: '#66A19C',
  //   borderColor: '#66A19C',
  //   pointBackgroundColor: '#fff',
  //   pointBorderColor: '#66A19C',
  //   pointHoverBackgroundColor: '#fff',
  //   // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  // }
  // ];
  private dateFormatter = ({ x }) => moment(x).format("MMM DD");
  private numberFormatter = x => x.toLocaleString();

  private capitalize = ([first, ...rest]) =>
    first.toUpperCase() + rest.join("").toLowerCase();
  startDate = [];
  endDate = [];
  startMonth;
  endMonth;

  constructor(private cubejs: CubejsClient, private composerService: ComposerService, private router: Router) {
    this.querySubject = new Subject();
    this.composerService.getLineChartSubscriptionDetails().subscribe(data => {
      this.query = data.obj;
      if (this.query != undefined) {
        this.ready = false;
        this.showChart = false;
        this.startDate = this.query.timeDimensions[0].compareDateRange[0];
        this.endDate = this.query.timeDimensions[0].compareDateRange[1];


        var x = this.options.filter(e => e.firstDay == this.startDate[0]);
        this.startMonth = x[0].label;

        var y = this.options.filter(e => e.firstDay == this.endDate[0]);
        this.endMonth = y[0].label;


        // console.log(this.query.timeDimensions[0].compareDateRange[0]);
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

  selectStartDate(option) {
    var x = this.options.filter(e => e.firstDay == option.firstDay);
    this.startMonth = x[0].label;
    if (this.startMonth != '' && this.endMonth != '') {
      //build compareDateRange
      this.startDate = [];
      this.startDate.push(x[0].firstDay);
      this.startDate.push(x[0].lastDay);
      console.log(this.startDate);

      var z = [];
      z.push(this.startDate);
      z.push(this.endDate);
      this.compareDateRange.emit(z);
    }
  }

  selectEndDate(option: any) {
    var x = this.options.filter(e => e.firstDay == option.firstDay);
    this.endMonth = x[0].label;
    if (this.startMonth != '' && this.endMonth != '') {
      //build compareDateRange
      this.endDate = [];
      this.endDate.push(x[0].firstDay);
      this.endDate.push(x[0].lastDay);
      console.log(this.endDate);


      var z = [];
      z.push(this.startDate);
      z.push(this.endDate);
      this.compareDateRange.emit(z);
    }
  }

  resultChanged(resultSet) {
    this.data = resultSet.chartPivot();
    // console.log(resultSet.chartPivot()[0].x);
    console.log(resultSet.seriesNames()[0]);

    this.commonSetup(resultSet);
    if (this.chartType == "line") {
      this.setMonthlyComparison();
    }
  }

  commonSetup(resultSet) {
    this.chartLabels = [];
    resultSet.chartPivot().map((item, i) => {
      this.chartLabels.push(parseInt(i + 1));
      this.chartData = resultSet.seriesNames().map(({ key, title }) => ({
        data: resultSet.chartPivot().map((element) => element[key]),
        label: title,
        lineTension: 0,
        fill: false
      }));
    });

    //Change Colors if there is only 1 data set to ensure that the graph displays the correct color of the selected month
    if (this.chartData.length == 1) {
      var m = this.chartData[0].label.split('-')[1];

      var startMonth = this.startDate[0].split('-')[1];
      var endMonth = this.endDate[0].split('-')[1];


      if (m == startMonth) {
        this.barChartColors = [
          {//green
            backgroundColor: '#66A19C',
            borderColor: '#66A19C',
            pointBackgroundColor: '#fff',
            pointBorderColor: '#66A19C',
            pointHoverBackgroundColor: '#fff',
            // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
          }
        ];

      }
      else if (m == endMonth) {
        this.barChartColors = [
          { //yellow
            backgroundColor: '#F6B72B',
            borderColor: '#F6B72B',
            pointBackgroundColor: '#fff',
            pointBorderColor: '#F6B72B',
            pointHoverBackgroundColor: '#fff',
            // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
          },
        ];
      }
    }

    else {
      this.barChartColors = [
        {//green
          backgroundColor: '#66A19C',
          borderColor: '#66A19C',
          pointBackgroundColor: '#fff',
          pointBorderColor: '#66A19C',
          pointHoverBackgroundColor: '#fff',
          // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { //yellow
          backgroundColor: '#F6B72B',
          borderColor: '#F6B72B',
          pointBackgroundColor: '#fff',
          pointBorderColor: '#F6B72B',
          pointHoverBackgroundColor: '#fff',
          // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },

      ];
    }
    console.log(this.chartData.length);
  }


  setMonthlyComparison() {
    this.chartType = "line";
    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        yAxes: [{
          ticks: {
            callback: function (label, index, labels) {
              return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " KW";
            }
          },
        }]
      },
      legend: {
        display: false
      }
    };
    this.showChart = true;
    this.ready = true;
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
