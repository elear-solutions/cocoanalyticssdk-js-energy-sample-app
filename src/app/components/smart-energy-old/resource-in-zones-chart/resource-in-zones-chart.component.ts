import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { CubejsClient } from "@cubejs-client/ngx";
import { Subject } from "rxjs";
import * as moment from "moment";
import { ComposerService } from "src/app/services/composer.service";
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router,NavigationEnd } from '@angular/router';
import { map, filter, distinctUntilChanged, pairwise,takeUntil } from 'rxjs/operators';
import { MultiDataSet, Label, SingleDataSet,PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { ModalDirective } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-resource-in-zones-chart',
  templateUrl: './resource-in-zones-chart.component.html',
  styleUrls: ['./resource-in-zones-chart.component.scss']
})

export class ResourceInZonesChartComponent implements OnInit {
  @ViewChild('rules_resourcesModal') rules_resourcesModal: ModalDirective;
  @Input() chartType;
  @Input() query;
  @Input() timePeriod;
  @Input() title;

  public chartData=[];
  public temp=[];
  public chart1Array=[];
  public chart2Array=[];
  public chart3Array=[];
  public tempChartData;
  public chartLabels:any=[];
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    innerRadius: "10%",
  };
  public chartColors;
  private querySubject;
  ready = false;
  showChart = false;
  data:any="";
  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: SingleDataSet = [];
  public absoluteTotal:any=0;
  public absoluteTotalFormatted:any=0;
  min:any;
  max:any;
  completionPercent:number=0;
  selectedFilter:any="Hourly";
  individualResourceQuery={};

  // [350, 450, 100, 200, 200],
  // ];

  public barChartColors: any = [
    {
      backgroundColor: ['#E27373', '#BD7BED', '#0097F9', '#EDAD2B', '#E58D23', '#14BC90', '#40D5D5' ]
    }
  ];
  private dateFormatter = ({ x }) => moment(x).format("MMM DD");
  private numberFormatter = x => x.toLocaleString();

  private capitalize = ([first, ...rest]) =>
  first.toUpperCase() + rest.join("").toLowerCase();
  total:any="";
  networkId:any="5eb99586c46daa001080a30c";
  resources=[{
    "3/zigbee/3C6A2CFFFED0AEFA/01":"Bedroom",
    "3/zigbee/14B457FFFE003619/01":"Master Bedroom",
    "3/zigbee/14B457FFFE002ECC/01":"Kitchen",
    "3/zigbee/3C6A2CFFFED0AEE2/01":"Kitchen",
    "3/zigbee/3C6A2CFFFED0827A/01":"Living Room",
    "3/zigbee/3C6A2CFFFED05755/01":"Living Room",
    "3/zigbee/3C6A2CFFFED0AF76/01":"Master Bathroom",
  }];
  resourceNames={
    "3/zigbee/3C6A2CFFFED0AEB2/01":"A/C",
    "3/zigbee/14B457FFFE003619/01":"A/C",
    "3/zigbee/3C6A2CFFFED0AF76/01":"Water Heater",
    "3/zigbee/3C6A2CFFFED0827A/01":"Energy Meter",
    "3/zigbee/3C6A2CFFFED0AEFA/01":"A/C",
    "3/zigbee/14B457FFFE002ECC/01":"Fridge",
    "3/zigbee/3C6A2CFFFED0AEE2/01":"Water Heater",
    "3/zigbee/3C6A2CFFFED05755/01":"Smart Plug",
  }

  images={
    "3/zigbee/3C6A2CFFFED0AEB2/01":"https://static-assets.getcoco.buzz/images/coco-home/resources/ac.png",
    "3/zigbee/14B457FFFE003619/01":"https://static-assets.getcoco.buzz/images/coco-home/resources/ac.png",
    "3/zigbee/3C6A2CFFFED0AF76/01":"https://static-assets.getcoco.buzz/images/coco-home/resources/geyser.png",
    "3/zigbee/3C6A2CFFFED0827A/01":"https://static-assets.getcoco.buzz/images/coco-home/resources/energy-meter.png",
    "3/zigbee/3C6A2CFFFED0AEFA/01":"https://static-assets.getcoco.buzz/images/coco-home/resources/ac.png",
    "3/zigbee/14B457FFFE002ECC/01":"https://static-assets.getcoco.buzz/images/coco-home/resources/refrigerator.png",
    "3/zigbee/3C6A2CFFFED0AEE2/01":"https://static-assets.getcoco.buzz/images/coco-home/resources/geyser.png",
    "3/zigbee/3C6A2CFFFED05755/01":"https://static-assets.getcoco.buzz/images/coco-home/resources/plug.png",
  }
  selectedResource:any="";
  selectedResourceName:any="";

  constructor(private cubejs: CubejsClient, private composerService: ComposerService, private router:Router) {
    this.querySubject = new Subject();

    this.composerService.getZoneAndResourceConsumedSubscriptionDetails().subscribe(data => {
      this.query=data.obj;
      if(this.query != undefined){
        this.showChart = false;
        this.ready=false;
        this.resultChanged = this.resultChanged.bind(this);

        this.cubejs
        .watch(this.querySubject)
        .subscribe(this.resultChanged, err => console.log("HTTP Error", err));
        this.querySubject.next(this.query);
      }
    });
  }


  ngOnInit(){

  }

  resultChanged(resultSet) {
    this.commonSetup(resultSet);
    this.setEnergyConsumptionbyZonesData();
  }
  commonSetup(resultSet) {
    this.chartData=[];
    this.chartLabels=[];
    this.doughnutChartLabels=[];
    this.doughnutChartData=[];
    var tempData=[];

    if(this.timePeriod == 'Hourly'){
      this.tempChartData = resultSet.seriesNames().map(({ key, title }) => ({
        data: resultSet.chartPivot().map((element) => element[key]),
        label: title,
        zoneId:this.resources[0][title.split(',')[0]]
      }));

    }
    else{
      this.tempChartData=[];

      resultSet.chartPivot().map(item=>{
        var data;
        if(this.timePeriod == 'Daily'){
          data=item['EnergyDemandWatt.dailyEnergyDemandKWh'];
        }
        if(this.timePeriod == 'Monthly'){
          data=item['EnergyDemandWatt.monthlyEnergyDemandKWh'];
        }


        this.tempChartData.push({
          data: data, ///time timePeriod
          label: item['x'],
          zoneId:this.resources[0][item['x']]
        })
      });
    }

    if(this.timePeriod == 'Hourly'){
      let dateTime = new Date();
      let hr = dateTime.getHours() - 5;
      var total = 0;
      var consolidatedArray=[];
      var energyConsumptionGroupedByZone;
      this.chart2Array=[];
      for(var i=0; i< this.tempChartData.length;i++){
        var resourceValue:any = parseFloat(this.tempChartData[i].data[hr]).toFixed(2);
        total = total+parseFloat(resourceValue);
        consolidatedArray.push({
          value:resourceValue,
          resourceEui: this.tempChartData[i].label.split(',')[0],
          zoneId:this.tempChartData[i].zoneId
        });
        this.doughnutChartData.push(resourceValue);
        this.temp.push(resourceValue);
        // Group by ZoneId as key to the person array
        //energyConsumptionGroupedByZone = this.groupBy(consolidatedArray, 'zoneId');
      }
      for(var i=0; i< consolidatedArray.length;i++){
        var resourceValue:any = parseFloat(consolidatedArray[i].value).toFixed(2);
        let resourcePercent:any=0;
        if(resourceValue == 0.00){
          resourcePercent=0;
        }
        else{
          resourcePercent = (resourceValue/total)*100;
        }
        this.doughnutChartLabels.push(this.resourceNames[consolidatedArray[i].resourceEui]+ ' ' +resourcePercent.toFixed(2) + ' %');

        //Build TOP 4 RESOURCE LEADER array and Individual Resources Array
        this.max=Math.max(...this.temp);
        this.min=Math.min(...this.temp);

        this.chart2Array.push({
          resourceEUI:this.resourceNames[consolidatedArray[i].resourceEui],
          resourceEUIId:consolidatedArray[i].resourceEui,
          value:resourceValue,
          completionPercent:resourcePercent,
          imageURL:this.images[consolidatedArray[i].resourceEui]
        });
      }
      this.total=total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    else{
      var consolidatedArray=[];
      var energyConsumptionGroupedByZone;
      var total=0;
      this.chart2Array=[];
      for(var i=0; i< this.tempChartData.length;i++){
        var resourceValue:any = parseFloat(this.tempChartData[i].data).toFixed(2);
        var total = total+parseFloat(resourceValue);
        consolidatedArray.push({
          value:resourceValue,
          resourceEui: this.tempChartData[i].label.split(',')[0],
          zoneId:this.tempChartData[i].zoneId
        });
        this.doughnutChartData.push(resourceValue);
        this.temp.push(resourceValue); //Required for Leaderboard
      }

      for(var i=0; i< consolidatedArray.length;i++){
        var resourceValue:any = parseFloat(consolidatedArray[i].value).toFixed(2);
        let resourcePercent:any=0;
        if(resourceValue == 0.00){
          resourcePercent=0;
        }
        else{
          resourcePercent = (resourceValue/total)*100;
        }

        this.doughnutChartLabels.push(this.resourceNames[consolidatedArray[i].resourceEui]+ ' ' +resourcePercent.toFixed(2) + ' %');

        //Build TOP 4 RESOURCE LEADER array and Individual Resources Array
        this.max=Math.max(...this.temp);
        this.min=Math.min(...this.temp);

        this.chart2Array.push({
          resourceEUI:this.resourceNames[consolidatedArray[i].resourceEui],
          resourceEUIId:consolidatedArray[i].resourceEui,
          value:resourceValue,
          completionPercent:resourcePercent,
          imageURL:this.images[consolidatedArray[i].resourceEui]
        });
      }

      this.total=total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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
    beforeDraw: (chart:any) => {
        var lineHeight=25;
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
      const newFontSize = Math.floor(13 * widthRatio);
      const newFontSize2 = Math.floor(6 * widthRatio);
      const elementHeight = (chart.innerRadius * 2);
      lineHeight=newFontSize;
      // if(newFontSize<25){
      //   lineHeight=10;
      // }
      // if(newFontSize > 25 && newFontSize <=30){
      //   lineHeight=20;
      // }

      // Draw text in center
      centerY -= (2 / 2) * lineHeight;
      for(var i = 0; i < 2; i++){
        centerY += lineHeight;
        if(i == 0){
          // Pick a new font size so it will not be larger than the height of label.
          const fontSizeToUse = Math.min(newFontSize, elementHeight);

          // ctx.font = 44 + 'px';
          ctx.fillStyle = '#212121';
          // ctx.weight=bold;
          ctx.family="'Quicksand', sans-serif";
          ctx.font =   "bold " + fontSizeToUse + "px Quicksand";
          ctx.fillText(this.total, centerX, centerY);
        }
        else if(i == 1){
          const fontSizeToUse = Math.min(newFontSize2, elementHeight);

          ctx.font = fontSizeToUse + 'px Quicksand';
          ctx.fillStyle = '#757575';
          ctx.fillText("Total kWh", centerX, centerY);
        }
      }
    }
  }];
  // public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
  //   beforeDraw: (chart:any) => {
  //     var lineHeight=25;
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
  //     var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
  //
  //     //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
  //     const stringWidth = ctx.measureText(txt).width;
  //     const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
  //
  //     // Find out how much the font can grow in width.
  //     const widthRatio = elementWidth / stringWidth;
  //     const newFontSize = Math.floor(13 * widthRatio);
  //     const newFontSize2 = Math.floor(6 * widthRatio);
  //     const elementHeight = (chart.innerRadius * 2);
  //     lineHeight=newFontSize;
  //
  //     // Draw text in center
  //     centerY -= (2 / 2) * lineHeight;
  //     for(var i = 0; i < 2; i++){
  //       centerY += lineHeight;
  //       if(i == 0){
  //         // Pick a new font size so it will not be larger than the height of label.
  //         const fontSizeToUse = Math.min(newFontSize, elementHeight);
  //
  //         ctx.fillStyle = '#212121';
  //         ctx.family="'Quicksand', sans-serif";
  //         ctx.font =   "bold " + fontSizeToUse + "px Quicksand";
  //         ctx.fillText(this.total, centerX, centerY);
  //       }
  //       else if(i == 1){
  //         const fontSizeToUse = Math.min(newFontSize2, elementHeight);
  //
  //         ctx.font = fontSizeToUse + 'px Quicksand';
  //         ctx.fillStyle = '#757575';
  //         ctx.fillText("Total kWh", centerX, centerY);
  //       }
  //     }
  //   }
  // }];

  getChartQuery(timePeriod) {
    this.selectedFilter = timePeriod;
    this.individualResourceQuery={};
    this.getIndividualResourceConsumption();
  }

  getIndividualResourceConsumption(){
    if(this.selectedFilter == "Hourly"){
      this.individualResourceQuery=
      {
        "measures": [
          "EnergyDemandWatt.hourlyEnergyDemandKWh"
        ],
        "timeDimensions": [
          {
            "dimension": "EnergyDemandWatt.energyTime",
            "granularity": "hour",
            "dateRange": "Today"
          }
        ],
        "order": {
          "EnergyDemandWatt.energyTime": "asc"
        },
        "dimensions": [],
        "filters": [
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "equals",
            "values": [
              this.selectedResource
            ]
          },
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          }
        ]
      }
    }

    else if (this.selectedFilter == 'Daily') {

      this.individualResourceQuery =
      {
        "measures": [
          "EnergyDemandWatt.dailyEnergyDemandKWh"
        ],
        "timeDimensions": [
          {
            "dimension": "EnergyDemandWatt.energyTime",
            "granularity": "day",
            "dateRange": "This month"
          }

        ],
        "order": {
          "EnergyDemandWatt.energyTime": "asc"
        },
        "dimensions": [],
        "filters": [
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "equals",
            "values": [
              this.selectedResource
            ]
          },
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          }
        ]
      }

      // this.showChart = true;

    }
    else if (this.selectedFilter == 'Monthly') {
      this.individualResourceQuery =
      {
        "measures": [
          "EnergyDemandWatt.monthlyEnergyDemandKWh"
        ],
        "timeDimensions": [
          {
            "dimension": "EnergyDemandWatt.energyTime",
            "granularity": "month",
            "dateRange": "This year"
          }
        ],
        "order": {
          "EnergyDemandWatt.energyTime": "asc"
        },
        "dimensions": [],
        "filters": [
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "equals",
            "values": [
              this.selectedResource
            ]
          },
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          }
        ]
      }
    }
    this.composerService.setIndividualResourceSubscriptionDetails(this.individualResourceQuery);
  }

  showIndividualResourceModal(resource){
    this.selectedResource=resource.resourceEUIId;
    this.selectedResourceName=resource.resourceEUI;
    this.getIndividualResourceConsumption();
    this.rules_resourcesModal.show();
  }

  setEnergyConsumptionbyZonesData(){

    this.chartOptions = {
      ...this.chartOptions,
      legend: {
        position:"right",
        display:true,
        height:"50px",
        labels: {
          fontSize:16,
          padding:23,
          usePointStyle: true
        }
      },
      cutoutPercentage: 80,
    };
    this.showChart = true;
    this.ready=true;

  }
}
