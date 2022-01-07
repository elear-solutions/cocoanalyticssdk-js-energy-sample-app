import { Component, Input, OnChanges } from "@angular/core";
import { Label, SingleDataSet, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnChanges {
  @Input()
  timeResolution!: string;
  @Input()
  dataset!: { data: string | any[]; };
  @Input()
  chartType!: string;
  @Input()
  title!: string;
  @Input()
  mode!: string;
  @Input()
  zones: any[] = [{}];
  @Input()
  resources: any[] = [{}];

  showChart: boolean = false;
  alertThreshold = 3500;

  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "right",
      display: true,
      height: "50px",
      labels: {
        fontSize: 16,
        padding: 23,
        usePointStyle: true,
        backgroundColor: ['#BD7BED', '#E27373', '#40D5D5', '#0097F9', '#EDAD2B', '#E58D23', '#14BC90']

      }
    },
    cutoutPercentage: 80,
  };

  public chartLabels: Label[] = [];
  // public chartPlugins: any[] = [];
  public chartColors: any = [
    {
      backgroundColor: ['#BD7BED', '#E27373', '#40D5D5', '#0097F9', '#EDAD2B', '#E58D23', '#14BC90']
    }
  ];
  public chartData: SingleDataSet = [];

  constructor() { }

  ngOnChanges(): void {
    this.chartLabels = [];
    this.chartData = [];

    if (this.mode == "zones") {
      this.getEnergyConsumedByZones();
    }

    else if (this.mode == "resources") {
      this.getEnergyConsumedByResources();
    }
  }

  getEnergyConsumedByZones() {

    //To be removed in Phase 2
    for (var i = 0; i < this.zones?.length; i++) {
      this.chartLabels.push(this.zones[i].zoneName + '   ' + 'N/A Kw');
      this.chartData.push(1);
    }
    this.showChart = true;

    //Required for Phase 2
    // if (this.dataset && this.dataset.data) {

    //   for (var i = 0; i < this.dataset.data.length; i++) {
    //     if (i < this.zones.length) {
    //       // this.chartLabels.push(this.zones[i].zoneName + '   ' + 'N/A Kw')
    //       this.chartData.push(1);
    //     }
    //     // this.dataset.data[i].value

    //     if (this.timeResolution == "Hourly") {
    //       this.getTimes(this.dataset.data[i].time, i);
    //     }

    //     else if (this.timeResolution == "Daily") {
    //       this.getDays(this.dataset.data[i].time, i);
    //     }
    //     else if (this.timeResolution == "Monthly") {
    //       this.getMonths(this.dataset.data[i].time, i);
    //     }
    //   }
    //   this.showChart = true;
    // }
  }

  //To be removed in Phase 2
  getEnergyConsumedByResources() {
    for (var i = 0; i < this.resources?.length; i++) {
      this.chartLabels.push(this.resources[i].name + '   ' + 'N/A Kw')
      this.chartData.push(1);
    }

    if (!this.resources) {
      this.chartData.push(1);
    }
    this.showChart = true;

    //Required for Phase 2
    // if (this.dataset && this.dataset.data) {
    //   // this.setBarChartColors();
    //   console.log("in chart ");
    //   console.log(this.dataset);

    //   // this.barChartData[0].label=this.selectedResource.name;
    //   for (var i = 0; i < this.dataset.data.length; i++) {
    //     if (i < this.resources.length) {
    //       // this.barChartLa  bels.push(this.resources[i].name + '   ' + 'N/A Kw');
    //       this.chartData.push(1);
    //     }
    //     // this.dataset.data[i].value


    //     if (this.timeResolution == "Hourly") {
    //       this.getTimes(this.dataset.data[i].time, i);
    //     }

    //     else if (this.timeResolution == "Daily") {
    //       this.getDays(this.dataset.data[i].time, i);
    //     }
    //     else if (this.timeResolution == "Monthly") {
    //       this.getMonths(this.dataset.data[i].time, i);
    //     }
    //   }
    //   this.showChart = true;
    // }
  }

  public chartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
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

  getTimes(dateTime: any, i: number) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = Utils.convertUTCDateToLocalDate(dateTime);
    var hours = parseInt(d.getHours().toString()) < 10 ? "0" + d.getHours().toString() : d.getHours().toString();
    var mins = parseInt(d.getMinutes().toString()) < 10 ? "0" + d.getMinutes().toString() : d.getMinutes().toString();
    var time = (hours + ":" + mins);


    var res = Utils.convertMilitaryTimeToStandardTime(time);
    if (i % 2 === 0) {
      // this.chartLabels.push([res, d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear().toString()]);
    }
    else {
      // this.chartLabels.push("");
    }
  }

  getDays(dateTime: any, i: number) {
    var d = Utils.convertUTCDateToLocalDate(dateTime);
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (i % 2 === 0) {
      // this.chartLabels.push(months[d.getMonth()] + ' ' + d.getDate().toString());
    }
    else {
      // this.chartLabels.push("");
    }
  }

  getMonths(dateTime: any, i: number) {
    var d = Utils.convertUTCDateToLocalDate(dateTime);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (i % 2 === 0) {
      // this.chartLabels.push([months[d.getMonth()], d.getFullYear().toString()]);
    }
    else {
      // this.chartLabels.push("");
    }
  }
}
