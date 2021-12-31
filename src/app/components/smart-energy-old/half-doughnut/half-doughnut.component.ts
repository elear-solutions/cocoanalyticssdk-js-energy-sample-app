import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CubejsClient } from "@cubejs-client/ngx";
import { Subject } from "rxjs";
import * as moment from "moment";
import { ComposerService } from "src/app/services/composer.service";
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, filter, distinctUntilChanged, pairwise, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-half-doughnut',
  templateUrl: './half-doughnut.component.html',
  styleUrls: ['./half-doughnut.component.scss']
})
export class HalfDoughnutComponent implements OnInit {

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
  total: any = "";

  private dateFormatter = ({ x }) => moment(x).format("MMM DD");
  private numberFormatter = x => x.toLocaleString();

  private capitalize = ([first, ...rest]) =>
    first.toUpperCase() + rest.join("").toLowerCase();


  constructor(private cubejs: CubejsClient, private composerService: ComposerService, private router: Router) {
    this.querySubject = new Subject();
    this.composerService.getHalfDoughnutChartSubscriptionDetails().subscribe(data => {
      this.query = data.obj;


      if (this.query != undefined) {
        this.showChart = true;
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
    this.total = parseInt(this.data[0]['EnergyDemandWatt.currentEnergyDemandKWh']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " kWh";

    this.commonSetup(resultSet);
    this.ready = true;
  }

  commonSetup(resultSet) {
    this.chartLabels = [];
    resultSet.chartPivot().map((item, i) => {
      // console.log(resultSet.chartPivot()[0].x);
      // console.log(resultSet.seriesNames()[0]);
      // item.category + ' '+ parseFloat(item['Energy.energyConsumptionAvg']).toFixed(2) + ' KW'
      //  this.chartLabels.push("Day "+parseInt(i + 1)) ;
      // this.chartData = resultSet.seriesNames().map(({ key, title }) => ({
      //   data: resultSet.chartPivot().map((element) => element[key]),
      //   label: item.category,
      //   lineTension:0,
      //   fill: false
      // }));
    });
  }


  // setMonthlyComparison(){
  //   this.chartType = "line";
  //   this.chartOptions = {
  //     ...this.chartOptions,
  //     scales: {
  //       yAxes: [{
  //         ticks: {
  //           callback: function(label, index, labels) {
  //             return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +" KW";
  //           }
  //         },
  //       }]
  //     },
  //     legend: {
  //       display:false
  //     }
  //   };
  //   this.showChart=true;
  // }

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
