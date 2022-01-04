import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { Subject } from "rxjs";
import * as moment from "moment";
// import { ComposerService } from "src/app/services/composer.service";
// import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, filter, distinctUntilChanged, pairwise, takeUntil } from 'rxjs/operators';
import { MultiDataSet, Label, SingleDataSet, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';


@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnChanges {
  @Input()
  timeResolution!: string;
  @Input()
  zones: any[] = [{}];
  @Input()
  dataset!: { data: string | any[]; };
  @Input()
  graphType!: string;
  showChart: boolean = false;
  title = "";
  ready: boolean = false;
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
  };

  public barChartLabels: Label[] = [];
  public chartType!: any;
  public barChartLegend = true;
  public barChartPlugins: any[] = [];
  public doughnutChartColors: any = [
    {
      backgroundColor: ['#E27373', '#BD7BED', '#40D5D5', '#0097F9', '#EDAD2B', '#E58D23', '#14BC90',]
    }
  ];
  // public barChartData: any[] = [
  //   { data: [], label: '' },
  // ];
  public doughnutChartData: SingleDataSet = [];
  alertThreshold = 3500;
  constructor() { }

  ngOnChanges(): void {
    this.barChartLabels = [];
    this.doughnutChartData = [];
    this.chartType = this.graphType;

    for (var i = 0; i < this.zones?.length; i++) {
      this.barChartLabels.push(this.zones[i].zoneName + '   ' + 'N/A Kw')
      this.doughnutChartData.push(0)
    }
    console.log(this.doughnutChartData);

    console.log(this.barChartLabels);
    // this.doughnutChartColors = [];


    if (this.dataset && this.dataset.data) {
      // this.setBarChartColors();
      console.log("in chart ");
      console.log(this.dataset);

      // this.barChartData[0].label=this.selectedResource.name;
      for (var i = 0; i < this.dataset.data.length; i++) {
        if (i < this.zones.length)
          this.doughnutChartData.push(1
            // this.dataset.data[i].value
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


      this.chartOptions = {
        ...this.chartOptions,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "right",
          display: true,
          height: "50px",
          labels: {
            fontSize: 16,
            padding: 23,
            usePointStyle: true
          }
        },
        cutoutPercentage: 80,
      };
      this.showChart = true;
    }
  }

  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
    beforeDraw: (chart: any) => {
      var lineHeight = 25;
      const ctx = chart.ctx;
      // const txt = this.total;
      const txt = "N/A";

      //Get options from the center object in options
      const sidePadding = 60;
      const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);


      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(12 * widthRatio);
      const newFontSize2 = Math.floor(7 * widthRatio);
      const elementHeight = (chart.innerRadius * 2);
      lineHeight = newFontSize;

      //23


      // if(newFontSize<25){
      //   lineHeight=18;
      // }
      // else if(newFontSize > 20 && newFontSize <=36){
      //   lineHeight=30;
      // }
      // else if(newFontSize > 37 ){
      //   lineHeight=;
      // }

      // Draw text in center

      centerY -= (2 / 2) * lineHeight;
      for (var i = 0; i < 2; i++) {
        centerY += lineHeight;
        if (i == 0) {
          // Pick a new font size so it will not be larger than the height of label.
          const fontSizeToUse = Math.min(newFontSize, elementHeight);
          // ctx.font = 44 + 'px';
          ctx.fillStyle = '#212121';
          // ctx.weight=bold;
          ctx.family = "'Quicksand', sans-serif";
          ctx.font = "bold " + fontSizeToUse + "px Quicksand";
          // ctx.lineHeight = "1rem";
          // ctx.fillText(this.total, centerX, centerY);
          ctx.fillText('N/A', centerX, centerY);
        }
        else if (i == 1) {
          const fontSizeToUse = Math.min(newFontSize2, elementHeight);

          ctx.font = fontSizeToUse + 'px Quicksand';
          ctx.fillStyle = '#757575';
          // ctx.lineHeight = "2rem";
          ctx.fillText("Total kWh", centerX, centerY);
        }

      }
    }
  }];

  // setBarChartColors() {
  //   this.barChartColors = [];
  //   var color = [];
  //   for (var j = 0; j < this.dataset.data.length; j++) {
  //     if (parseInt(this.dataset.data[j]) > this.alertThreshold) {
  //       color.push('#E27373');
  //     }
  //     else {
  //       color.push('#66a19c');
  //     }
  //   }
  //   this.barChartColors.push({ backgroundColor: color })
  // }

  getTimes(dateTime: any, i: number) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = this.convertUTCDateToLocalDate(dateTime);
    var hours = parseInt(d.getHours().toString()) < 10 ? "0" + d.getHours().toString() : d.getHours().toString();
    var mins = parseInt(d.getMinutes().toString()) < 10 ? "0" + d.getMinutes().toString() : d.getMinutes().toString();
    var time = (hours + ":" + mins);


    this.convertMilitaryTimeToStandardTime(time).then((res: any) => {
      if (i % 2 === 0) {
        // this.barChartLabels.push([res, d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear().toString()]);
      }
      else {
        // this.barChartLabels.push("");
      }
    });
  }

  getDays(dateTime: any, i: number) {
    var d = this.convertUTCDateToLocalDate(dateTime);
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (i % 2 === 0) {
      // this.barChartLabels.push(months[d.getMonth()] + ' ' + d.getDate().toString());
    }
    else {
      // this.barChartLabels.push("");
    }
  }

  getMonths(dateTime: any, i: number) {
    var d = this.convertUTCDateToLocalDate(dateTime);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (i % 2 === 0) {
      // this.barChartLabels.push([months[d.getMonth()], d.getFullYear().toString()]);
    }
    else {
      // this.barChartLabels.push("");
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
