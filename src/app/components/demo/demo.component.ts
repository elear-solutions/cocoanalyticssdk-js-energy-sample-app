import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NetworkService } from 'src/app/services/network.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as moment from "moment";
import { Label } from 'ng2-charts';
declare var CocoAnalytics: any;
declare var getMeasures: any;
declare var Coco: any;
const capabilityEnergyMeter: number = 4;
const attributeEnergyMeterConsumption: number = 0;

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})

export class DemoComponent implements AfterViewInit {
  [x: string]: any;
  errorMessage: string = "";
  analyticsData: any = {};
  doughnutAnalyticsData: any = {};
  lineAnalyticsData: any = [];
  tempLine: any = [];
  analyticsHandle: any;
  userDetails: any = {};
  networks: any[] = [];
  resources: any[] = [];
  // selectedFilter: string = "";
  selectedNetwork: any = {
    networkId: "",
    networkName: ""
  };
  searchNetworkCtrl: FormControl = new FormControl();
  showChart: boolean = false;
  showLineChart: boolean = false;
  submitted: boolean = false;

  /*Bar Chart Configuration params*/
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartData: any[] = [{ data: [{}], label: '' },];
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  startDate: any = "2022-01-03"; //yy//mm/dd
  endDate: any = "2022-01-03";

  // startDate: any = "2022-01-01"; //yy//mm/dd
  // endDate: any = "2022-01-31";

  options = [
    { value: '3', label: 'Apr 2021', firstDay: '2021-04-01', lastDay: '2021-04-30' },
    { value: '3', label: 'May 2021', firstDay: '2021-05-01', lastDay: '2021-05-31' },
    { value: '3', label: 'Jun 2021', firstDay: '2021-06-01', lastDay: '2021-06-30' },
    { value: '3', label: 'Jul 2021', firstDay: '2021-07-01', lastDay: '2021-07-31' },
    { value: '3', label: 'Aug 2021', firstDay: '2021-08-01', lastDay: '2021-08-31' },
    { value: '3', label: 'Sep 2021', firstDay: '2021-09-01', lastDay: '2021-09-30' },
    { value: '3', label: 'Oct 2021', firstDay: '2021-10-01', lastDay: '2021-10-31' },
    { value: '3', label: 'Nov 2021', firstDay: '2021-11-01', lastDay: '2021-11-30' },
    { value: '3', label: 'Dec 2021', firstDay: '2021-12-01', lastDay: '2021-12-31' },
    { value: '3', label: 'Jan 2022', firstDay: '2022-01-01', lastDay: '2022-01-31' },
    { value: '3', label: 'Feb 2022', firstDay: '2022-02-01', lastDay: '2022-02-28' },
    { value: '3', label: 'March 2022', firstDay: '2022-03-01', lastDay: '2022-03-31' },
    { value: '3', label: 'April 2022', firstDay: '2022-04-01', lastDay: '2022-03-30' },
  ];

  constructor(public userService: UserService, public networkService: NetworkService, public spinnerService: SpinnerService) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.userService.currentUser.subscribe((data: Object) => {
      if (data != null) {
        this.userDetails = data;
        this.getNetworksList();
      }
    });

    Coco.getAccessToken().then(
      (data: any) => {
        var accessToken = data;
        CocoAnalytics.connect(accessToken).then((data: any) => {
          this.analyticsHandle = data;
        });
      }
    )
  }

  // getNetworksList1() {
  //   this.networkService.getNetworksList().then((res: any) => {
  //     res.response.networks.map((network: any) => {
  //       this.networks.push(network);
  //     });
  //   });
  //   console.log(this.networks);
  // }

  getNetworksList() {
    this.networkService.getNetworksList().then((res: any) => {
      this.networks = res.response.networks;
    })
  }

  selectNetwork(network: any) {
    var old_val = this.selectedNetwork.networkId;
    if (old_val != network.networkId) {
      this.analyticsData = {};
      // this.showChart = false;
      // //Clear
      // this.selectedZone = {
      //   zoneName: ''
      // }
      // this.selectedResource = {
      //   resourceName: ''
      // }
      // this.selectedCapability = {
      //   capabilityName: ''
      // }
      // this.selectedAttribute = {
      //   attributeName: ''
      // }
      // this.selectedMeasure = "";

      this.selectedNetwork.networkId = network.networkId;
      this.selectedNetwork.networkName = network.networkName;
      this.selectedNetwork.categoryName = network.categoryName;
      this.getNetworkZones();
    }
  }
  getNetworkZones() {
    this.networkService.getZoneNetworkList(this.selectedNetwork.networkId).then(
      (data: any) => {
        this.zones = data.response.zones;
        var arr = [];
        for (var i = 0; i < this.zones.length; i++) {
          arr.push(0);
        }
        this.doughnutAnalyticsData.data = arr;
        console.log(this.analyticsData);
        this.tempZones = data.response.zones;
        console.log(this.zones);
        this.getResourcesByZone();
      }, (error: any) => {
        console.log('getZoneNetworkList : ', error);
        return error;
      });
  }
  getResourcesByZone() {
    for (var i = 0; i < this.zones.length; i++) {
      this.networkService.getResourcesByZone(this.selectedNetwork.networkId, this.zones[i].zoneId).then(
        (data: any) => {
          for (var i = 0; i < data.response.resources.length; i++) {
            this.resources.push({
              resourceEui: data.response.resources[i].resourceEui,
              deviceNodeId: data.response.resources[i].deviceNodeId,
            })
            // data.response.resources[i].resourceEui + '/' + data.response.resources[i].deviceNodeId);
          }
          // this.resources = data.response.resources;
          // this.tempResources = data.response.resources;
          console.log(this.resources);
        }, (error: any) => {
          console.log('getResourceZoneList : ', error);
          return error;
        });
    }
  }

  resetNetworkSearch() {
    this.networks = [];
    if (this.searchNetworkCtrl != undefined) {
      this.searchNetworkCtrl.setValue("");
    }
  }
  setTimeResolution(resolution: string) {
    this.resolution = resolution;
    this.setDates();
  }

  setDates() {
    console.log(this.analyticsData);
    var date = new Date();

    if (this.resolution == "Hourly") {
      this.endDate = date.toISOString().split('.')[0];
      this.startDate = this.getRelativeHours(24);
      this.run();
    }
    else if (this.resolution == "Daily") {
      this.endDate = date.toISOString().split('.')[0];
      this.startDate = this.getRelativeDays(30);
      this.run();
    }

    else if (this.resolution == "Monthly") {
      this.endDate = date.toISOString().split('.')[0];
      this.startDate = this.getRelativeMonths(12);
      this.run();
    }
  }


  getRelativeHours(hr: any) {
    var date = new Date();
    var relativeDateTime = moment(date).subtract('hours', hr); //to get the date object
    return relativeDateTime.toISOString().split('.')[0]; //In UTC
  }

  getRelativeDays(day: any) {
    var date = new Date();
    var relativeDateTime = moment(date).subtract('day', day);//to get the date object
    return relativeDateTime.toISOString().split('.')[0]; //In UTC
  }

  getRelativeMonths(month: any) {
    var date = new Date();
    var relativeDateTime = moment(date).subtract('month', month); //to get the date object
    return relativeDateTime.toISOString().split('.')[0]; //In UTC

  }

  validate() {
    if (!this.selectedNetwork.networkName || !this.selectedZone.zoneName ||
      !this.selectedCapability.capabilityName || !this.selectedGraphType || !this.resolution || !this.displayFullDate || !this.selectedMeasure) {
      this.gotoTop();
      return false;
    }
    else return true;
  }
  run(mode?: string, lineDate?: string) {
    this.barChartData[0].data = [{}];
    this.spinnerService.setSpinner(true);
    this.submitted = true;
    // var valid = this.validate();
    // if (valid) {
    var attributeInfo = {
      capabilityId: capabilityEnergyMeter,
      attributeId: attributeEnergyMeterConsumption
    };

    var filters = {};

    filters = {
      resources: this.resources,
      zoneId: ""
    };

    var time = {
      dateRange: [this.startDate, this.endDate],
      resolution: this.resolution
    };
    CocoAnalytics.fetchData(this.analyticsHandle, this.selectedNetwork.networkId, attributeInfo, filters, time, this.selectedMeasure).then((response: any) => {
      if (mode == 'line') {
        if (lineDate == 'start') {
          this.tempLine.push(response);
        }
        else {
          this.tempLine.push(response);
          this.lineAnalyticsData = this.tempLine
          console.log("fetch line analytics");
          console.log(this.lineAnalyticsData);
        }
        this.showLineChart = true;
      }
      else {
        this.analyticsData = response;
        console.log(this.analyticsData);
      }
      // this.analyticsData = response;
      // this.showChart = this.isEmpty(this.analyticsData);
      // this.barChartData[0].label = this.selectedResource.name;

      for (var i = 0; i < response.data.length; i++) {
        this.barChartData[0].data.push(
          response.data[i].value
        );
        this.barChartLabels.push(response.data[i].time)
      }
      this.spinnerService.setSpinner(false);
    }, (error: any) => {
      this.spinnerService.setSpinner(false);
      this.gotoTop();
      this.errorMessage = error;
      setTimeout(() => {
        this.errorMessage = "";
      }, 5000);
    });

    console.log("ANALYTICS HANDLE");
    console.log(this.analyticsHandle);

    console.log("NETWORK ID");
    console.log(this.selectedNetwork.networkId);

    console.log("ATTRIBUTE INFO");
    console.log(attributeInfo);

    console.log("FILTERS");
    console.log(filters);

    console.log("TIME");
    console.log(time);

    console.log("MEASURE");
    // console.log(this.selectedMeasure);
    this.analyticsData = {};
    // }
    // else {
    this.spinnerService.setSpinner(false);
    // }
  }
  selectStartDate(option: any) {
    this.resolution = "Daily";
    var x = this.options.filter(e => e.firstDay == option.firstDay);
    this.startMonth = x[0].label;
    if (this.startMonth != '' && this.endMonth != '') {
      //build compareDateRange
      this.startDate = x[0].firstDay;
      this.endDate = x[0].lastDay;
      this.run('line', 'start');

      // this.startDate.push(x[0].firstDay);
      // this.startDate.push(x[0].lastDay);
      // console.log(this.startDate);

      // var z = [];
      // z.push(this.startDate);
      // z.push(this.endDate);
      // this.compareDateRange.emit(z);
    }
  }

  selectEndDate(option: any) {
    var x = this.options.filter(e => e.firstDay == option.firstDay);
    this.endMonth = x[0].label;
    if (this.startMonth != '' && this.endMonth != '') {
      // //build compareDateRange
      // this.endDate = [];
      // this.endDate.push(x[0].firstDay);
      // this.endDate.push(x[0].lastDay);
      // console.log(this.endDate);
      // var z = [];
      // z.push(this.startDate);
      // z.push(this.endDate);
      // this.compareDateRange.emit(z);

      this.startDate = x[0].firstDay;
      this.endDate = x[0].lastDay;
      this.run('line', 'end');
    }
  }
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}


