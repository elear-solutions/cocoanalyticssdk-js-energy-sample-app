import { Component, OnInit, Input } from "@angular/core";
import { CubejsClient } from "@cubejs-client/ngx";
import { Subject } from "rxjs";
import * as moment from "moment";
import { ComposerService } from "src/app/services/composer.service";
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, filter, distinctUntilChanged, pairwise, takeUntil } from 'rxjs/operators';
import { MultiDataSet, Label, SingleDataSet, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})

export class DoughnutChartComponent implements OnInit {
  @Input() chartType;
  @Input() query;
  @Input() timePeriod;
  @Input() title;

  public chartData = [];
  public tempChartData;
  public chartLabels: any = [];
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public chartColors;
  private querySubject;
  ready = false;
  showChart = false;
  data: any = "";
  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: SingleDataSet = [];
  // [350, 450, 100, 200, 200],
  // ];

  public barChartColors: any = [
    {
      backgroundColor: ['#E27373', '#BD7BED', '#40D5D5', '#0097F9', '#EDAD2B', '#E58D23', '#14BC90',]
    }
  ];
  private dateFormatter = ({ x }) => moment(x).format("MMM DD");
  private numberFormatter = x => x.toLocaleString();

  private capitalize = ([first, ...rest]) =>
    first.toUpperCase() + rest.join("").toLowerCase();
  public total: any = "";
  zones = [
    {
      "12388244331b7100161111zz": "Bedroom",
      "12388244331b7100161111zf": "Master Bedroom",
      "12388244331b7100161111zw": "Kitchen",
      "12388244331b7100161111zq": "Living Room",
      "12388244331b7100161111aa": "Master Bathroom",
    }];

  resources = [{
    "3/zigbee/3C6A2CFFFED0AEFA/01": "Bedroom",
    "3/zigbee/14B457FFFE003619/01": "Master Bedroom",
    "6/zigbee/14B457FFFE002ECC/01": "Kitchen",
    "3/zigbee/3C6A2CFFFED0AEE2/01": "Kitchen",
    "3/zigbee/3C6A2CFFFED0AEB2/01": "Living Room",
    "3/zigbee/3C6A2CFFFED0827A/01": "Living Room",
    "3/zigbee/3C6A2CFFFED05755/01": "Living Room",
    "3/zigbee/3C6A2CFFFED0AF76/01": "Master Bathroom",
  }];

  constructor(private cubejs: CubejsClient, private composerService: ComposerService, private router: Router) {
    this.querySubject = new Subject();
    this.composerService.getDoughnutChartSubscriptionDetails().subscribe(data => {
      this.query = data.obj;


      if (this.query != undefined) {
        this.title = "Zone Breakdown";
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
    // console.log(resultSet.loadResponses);
    // console.log(resultSet.ResultSet.results.data);
    if (this.timePeriod == 'Hourly') {
      this.title = "Zone Breakdown In the Past Hour"
    }
    else if (this.timePeriod == 'Daily') {
      this.title = "Zone Breakdown For Today"
    }
    else if (this.timePeriod == 'Monthly') {
      this.title = "Zone Breakdown For The Month"
    }
    // console.log("b "+resultSet.chartPivot()[0].x);
    // console.log("c "+resultSet.seriesNames()[0]);

    this.commonSetup(resultSet);
    if (this.chartType == "doughnut") {
      this.setEnergyConsumptionbyZonesData();
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
    this.chartData = [];
    this.chartLabels = [];
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    var tempData = [];

    if (this.timePeriod == 'Hourly') {
      this.tempChartData = resultSet.seriesNames().map(({ key, title }) => ({
        data: resultSet.chartPivot().map((element) => element[key]),
        label: title,
        zoneId: this.resources[0][title.split(',')[0]]
      }));
      console.log("souj");
      console.log(this.tempChartData);
    }
    else {
      this.tempChartData = [];
      resultSet.chartPivot().map(item => {
        var data;
        if (this.timePeriod == 'Daily') {
          data = item['EnergyDemandWatt.dailyEnergyDemandKWh'];
        }
        if (this.timePeriod == 'Monthly') {
          data = item['EnergyDemandWatt.monthlyEnergyDemandKWh'];
        }

        this.tempChartData.push({
          data: data, ///time timePeriod
          label: item['x'],
          zoneId: this.resources[0][item['x']]
        })
        // this.tempChartData = resultSet.seriesNames().map(({ key, title }) => ({
        //   data: resultSet.chartPivot().map((element) => element[key]),
        //   label: title,
        //   zoneId:this.resources[0][title.split(',')[0]]
        // }));
        // this.chartData = resultSet.seriesNames().map(({ key, title }) => ({
        //       data: resultSet.chartPivot().map((element) => element[key]),
        //       // label: item.category
        //     }));
        // console.log("olii");
        // console.log(this.chartData);
        // for(var i = 0; i<this.chartData[0].data.length; i++){
        // }
      });

    }

    //resultSet.chartPivot().map(item=>{

    //console.log(resultSet);

    //  });

    // resultSet.chartPivot().map(item=>{
    //   // console.log(item);
    //
    //
    //   if(this.timePeriod != 'Hourly'){
    //     if(this.timePeriod == 'Daily'){
    //       var zoneVal = parseFloat(item['EnergyDemandWatt.currentValueAvge']).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //     }
    //     else if(this.timePeriod == 'Monthly'){
    //       var zoneVal = parseFloat(item['EnergyDemandWatt.currentValueAvge']).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //     }
    //     this.chartLabels.push("  "+this.zones[0][item.category] + ' '+ zoneVal + ' kWh');
    //     this.chartData = resultSet.seriesNames().map(({ key, title }) => ({
    //       data: resultSet.chartPivot().map((element) => element[key]),
    //       label: item.category
    //     }));
    //   }
    //   else{ //Hourly
    //     this.tempChartData = resultSet.seriesNames().map(({ key, title }) => ({
    //       data: resultSet.chartPivot().map((element) => element[key]),
    //       label: title,
    //       zoneId:this.resources[0][title.split(',')[0]]
    //     }));
    //   }
    // });

    // if(this.timePeriod != 'Hourly'){
    //   var totalVal = 0;
    //   for(var i =0; i<this.chartData[0].data.length; i++){
    //     var zoneValue = parseFloat(this.chartData[0].data[i]).toFixed(2);
    //     totalVal = totalVal + parseFloat(zoneValue);
    //   }
    //   this.total = (totalVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')).toString();
    // }
    if (this.timePeriod == 'Hourly') {
      let dateTime = new Date();
      // let dateTime = this.convertUTCDateToLocalDate(new Date());
      let hr = dateTime.getHours() - 5;
      var totalVal = 0;
      var consolidatedArray = [];
      var energyConsumptionGroupedByZone;
      var sumOfZone: any = 0;
      var total = 0;
      console.log(this.tempChartData);
      for (var i = 0; i < this.tempChartData.length; i++) {
        var zoneValue = parseFloat(this.tempChartData[i].data[hr]).toFixed(2);
        consolidatedArray.push({
          value: zoneValue,
          resourceEui: this.tempChartData[i].label.split(',')[0],
          zoneId: this.tempChartData[i].zoneId
        });
        // Group by ZoneId as key to the person array
        energyConsumptionGroupedByZone = this.groupByZone(consolidatedArray, 'zoneId');
      }
      for (let key in energyConsumptionGroupedByZone) {
        if (energyConsumptionGroupedByZone.hasOwnProperty(key)) {
          sumOfZone = energyConsumptionGroupedByZone[key].reduce((sum, currentValue) => {
            return (sum + parseFloat(currentValue.value));
          }, 0);
          total = total + sumOfZone;

          this.doughnutChartData.push(parseFloat(sumOfZone));
          this.doughnutChartLabels.push(key + ' ' + sumOfZone.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' kWh');
        }
      }
      this.total = total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    else {
      var consolidatedArray = [];
      var energyConsumptionGroupedByZone;
      var sumOfZone: any = 0;
      var total = 0;
      for (var i = 0; i < this.tempChartData.length; i++) {
        var zoneValue = parseFloat(this.tempChartData[i].data).toFixed(2);
        consolidatedArray.push({
          value: zoneValue,
          resourceEui: this.tempChartData[i].label.split(',')[0],
          zoneId: this.tempChartData[i].zoneId
        });
        // Group by ZoneId as key to the person array
        energyConsumptionGroupedByZone = this.groupByZone(consolidatedArray, 'zoneId');
      }
      for (let key in energyConsumptionGroupedByZone) {
        if (energyConsumptionGroupedByZone.hasOwnProperty(key)) {
          sumOfZone = energyConsumptionGroupedByZone[key].reduce((sum, currentValue) => {
            return (sum + parseFloat(currentValue.value));
          }, 0);
          total = total + sumOfZone;
          this.doughnutChartData.push(parseFloat(sumOfZone));
          this.doughnutChartLabels.push(key + ' ' + sumOfZone.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' kWh');
        }
      }
      this.total = total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  readonly groupByZone = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue.zoneId] = result[currentValue.zoneId] || []).push(
        currentValue
      );
      return result;
    }, {});
  };

  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
    beforeDraw: (chart: any) => {
      var lineHeight = 25;
      const ctx = chart.ctx;
      const txt = this.total;

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
          ctx.fillText(this.total, centerX, centerY);
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

  // public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
  //   beforeDraw: (chart:any) => {
  //     const ctx = chart.ctx;
  //     const txt = this.total;
  //
  //     //Get options from the center object in options
  //     const sidePadding = 60;
  //     const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
  //
  //     ctx.textAlign = 'center';
  //     ctx.textBaseline = 'middle';
  //     const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
  //     // const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
  //
  //     const centerY=130;
  //
  //     const centerY1 = 170;
  //
  //     //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
  //     const stringWidth = ctx.measureText(txt).width;
  //     const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
  //
  //     // Find out how much the font can grow in width.
  //     const widthRatio = elementWidth / stringWidth;
  //     const newFontSize = Math.floor(22 * widthRatio);
  //     const elementHeight = (chart.innerRadius * 2);
  //
  //
  //
  //     // Draw text in center
  //
  //
  //     for(var i = 0; i < 2; i++){
  //       if(i == 0){
  //         // Pick a new font size so it will not be larger than the height of label.
  //         const fontSizeToUse = Math.min(newFontSize, elementHeight);
  //
  //         // ctx.font = 44 + 'px';
  //         ctx.fillStyle = '#212121';
  //         // ctx.weight=bold;
  //         ctx.family="'Quicksand', sans-serif";
  //         ctx.font =   "bold " + 30 + "px Quicksand";
  //         ctx.fillText(this.total, centerX, centerY);
  //       }
  //       else if(i == 1){
  //         const fontSizeToUse = Math.min(newFontSize, elementHeight);
  //
  //         ctx.font = 16 + 'px Quicksand';
  //         ctx.fillStyle = '#757575';
  //         ctx.fillText("Total kWh", centerX, centerY1);
  //       }
  //     }
  //   }
  // }];
  // public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
  //   beforeDraw: (chart:any) => {
  //     const ctx = chart.ctx;
  //     const txt = this.total;
  //
  //     //Get options from the center object in options
  //     const sidePadding = 60;
  //     const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
  //
  //     ctx.textAlign = 'center';
  //     ctx.textBaseline = 'middle';
  //     const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
  //     // const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
  //
  //     const centerY=130;
  //
  //     const centerY1 = 170;
  //
  //     //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
  //     const stringWidth = ctx.measureText(txt).width;
  //     const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
  //
  //     // Find out how much the font can grow in width.
  //     const widthRatio = elementWidth / stringWidth;
  //     const newFontSize = Math.floor(22 * widthRatio);
  //     const elementHeight = (chart.innerRadius * 2);
  //
  //
  //
  //     // Draw text in center
  //
  //
  //     for(var i = 0; i < 2; i++){
  //       if(i == 0){
  //         // Pick a new font size so it will not be larger than the height of label.
  //         const fontSizeToUse = Math.min(newFontSize, elementHeight);
  //
  //         // ctx.font = 44 + 'px';
  //         ctx.fillStyle = '#212121';
  //         // ctx.weight=bold;
  //         ctx.family="'Quicksand', sans-serif";
  //         ctx.font =   "bold " + fontSizeToUse + "px Quicksand";
  //         ctx.fillText(this.total, centerX, centerY);
  //       }
  //       else if(i == 1){
  //         const fontSizeToUse = Math.min(newFontSize, elementHeight);
  //
  //         ctx.font = 16 + 'px Quicksand';
  //         ctx.fillStyle = '#757575';
  //         ctx.fillText("Total kWh", centerX, centerY1);
  //       }
  //
  //     }
  //   }
  // }];

  setEnergyConsumptionbyZonesData() {
    this.chartType = "doughnut";
    //    if(this.timePeriod != 'Hourly'){
    //   this.chartType = "doughnut";
    //   this.chartOptions = {
    //     ...this.chartOptions,
    //     legend: {
    //       position:"right",
    //       display:true,
    //       height:"50px",
    //       labels: {
    //         fontSize:16,
    //         padding:23,
    //         usePointStyle: true
    //       },
    //
    //     },
    //     // cutoutPercentage: 80,
    //   };
    //
    // }

    // else{
    this.chartOptions = {
      ...this.chartOptions,
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

    // }
    this.ready = true;
    this.showChart = true;

  }
}
