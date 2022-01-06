import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NetworkService } from 'src/app/services/network.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as moment from "moment";
import { Label } from 'ng2-charts';
import { COCOHomeIcons } from 'src/app/utils/coco_home_icons';
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
  tempLineStart: any = {};
  tempLineEnd: any = {};
  analyticsHandle: any;
  userDetails: any = {};
  resolution: any = "";
  networks: any[] = [];
  resources: any[] = [];
  zoneResources: any[] = [];
  selectedNetwork: any = {
    networkId: "",
    networkName: ""
  };
  searchNetworkCtrl: FormControl = new FormControl();
  showTotalHomeConsumption: boolean = false;
  showEnergyConsumedByZones: boolean = false;
  showMonthlyComparisons: boolean = false;
  showCurrentEnergyConsumed: boolean = false;
  submitted: boolean = false;
  attributeInfo: any = {};
  filters: any = {};
  time: any = {};
  lineDate: any;

  startDate: any = ""; //yy//mm/dd
  endDate: any = "";

  options = [
    { label: 'Apr 2021', firstDay: '2021-04-01', lastDay: '2021-04-30' },
    { label: 'May 2021', firstDay: '2021-05-01', lastDay: '2021-05-31' },
    { label: 'Jun 2021', firstDay: '2021-06-01', lastDay: '2021-06-30' },
    { label: 'Jul 2021', firstDay: '2021-07-01', lastDay: '2021-07-31' },
    { label: 'Aug 2021', firstDay: '2021-08-01', lastDay: '2021-08-31' },
    { label: 'Sep 2021', firstDay: '2021-09-01', lastDay: '2021-09-30' },
    { label: 'Oct 2021', firstDay: '2021-10-01', lastDay: '2021-10-31' },
    { label: 'Nov 2021', firstDay: '2021-11-01', lastDay: '2021-11-30' },
    { label: 'Dec 2021', firstDay: '2021-12-01', lastDay: '2021-12-31' },
    { label: 'Jan 2022', firstDay: '2022-01-01', lastDay: '2022-01-31' },
    { label: 'Feb 2022', firstDay: '2022-02-01', lastDay: '2022-02-28' },
    { label: 'March 2022', firstDay: '2022-03-01', lastDay: '2022-03-31' },
    { label: 'April 2022', firstDay: '2022-04-01', lastDay: '2022-03-30' },
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


  getNetworksList() {
    this.networkService.getNetworksList().then((res: any) => {
      this.networks = res.response.networks;
    })
  }

  selectNetwork(network: any) {
    var old_val = this.selectedNetwork.networkId;
    if (old_val != network.networkId) {
      this.analyticsData = {};
      this.selectedNetwork.networkId = network.networkId;
      this.selectedNetwork.networkName = network.networkName;
      this.selectedNetwork.categoryName = network.categoryName;
      this.showCurrentEnergyConsumed = true;
      this.getNetworkZones();
    }
  }
  setDefaultDates() {
    this.selectStartDate(this.options[8]);
    setTimeout(() => {
      this.selectEndDate(this.options[9]);
    }, 500);
    this.showMonthlyComparisons = true;

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
        this.tempZones = data.response.zones;
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
          }
          console.log(this.resources);

        }, (error: any) => {
          console.log('getResourceZoneList : ', error);
          return error;
        });
    }
    setTimeout(() => {
      this.setDefaultDates();
    }, 500);

  }
  async getResourcesByZoneId() {
    this.networkService.getResourcesByZone(this.selectedNetwork.networkId, this.selectedZone).then(
      (data: any) => {
        this.zoneResources = data.response.resources;
        for (var i = 0; i < this.zoneResources.length; i++) {
          this.zoneResources[i].resourceIcon = COCOHomeIcons.getResourceIcon(this.zoneResources[i].metadataArr[0].metadata);
          var x = {
            resourceEui: this.zoneResources[i].resourceEui,
            deviceNodeId: this.zoneResources[i].deviceNodeId,
          };
          this.runIndividualResource(x, i);
        }

        console.log(this.zoneResouces);
      }, (error: any) => {
        console.log('getResourceZoneList : ', error);
        return error;
      });
  }
  onZoneClick(zoneId: any, i: any) {
    if (zoneId != undefined) {
      this.selectedZone = zoneId;
      this.getResourcesByZoneId();
    }
  }

  resetNetworkSearch() {
    this.networks = [];
    if (this.searchNetworkCtrl != undefined) {
      this.searchNetworkCtrl.setValue("");
    }
  }
  setTimeResolution(resolution: string) {
    this.showTotalHomeConsumption = true;
    this.showEnergyConsumedByZones = true;
    this.resolution = resolution;
    this.setDates();
  }

  setDates() {
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
    this.spinnerService.setSpinner(true);
    this.submitted = true;
    // var valid = this.validate();
    // if (valid) {
    this.attributeInfo = {
      capabilityId: capabilityEnergyMeter,
      attributeId: attributeEnergyMeterConsumption
    };

    this.filters = {};
    this.filters = {
      resources: this.resources,
      zoneId: ""
    };

    this.time = {
      dateRange: [this.startDate, this.endDate],
      resolution: mode == 'line' ? 'Daily' : this.resolution
    };
    CocoAnalytics.fetchData(this.analyticsHandle, this.selectedNetwork.networkId, this.attributeInfo, this.filters, this.time, this.selectedMeasure).then((response: any) => {

      if (mode == 'line') {
        this.lineDate = lineDate;

        if (lineDate == 'start') {
          this.tempLineStart = response;
        }
        else {
          this.tempLineEnd = response;
        }
        if (this.isEmpty(this.tempLineStart) == false && this.isEmpty(this.tempLineEnd) == false) {
          this.lineAnalyticsData = [];
          this.lineAnalyticsData.push(this.tempLineStart);
          this.lineAnalyticsData.push(this.tempLineEnd);
        }
      }
      else {
        this.analyticsData = response;
      }
      this.spinnerService.setSpinner(false);
    }, (error: any) => {
      this.showTotalHomeConsumption = false;
      this.showEnergyConsumedByZones = false;
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
    console.log(this.attributeInfo);

    console.log("FILTERS");
    console.log(this.filters);

    console.log("TIME");
    console.log(this.time);

    console.log("MEASURE");
    this.analyticsData = {};

    this.spinnerService.setSpinner(false);
  }

  isEmpty(obj: any) {
    if (Object.keys(obj).length == 0) {
      return true;
    }
    else {
      return false;
    }
  }
  async runIndividualResource(resource: any, i: number) {
    this.spinnerService.setSpinner(true);
    this.submitted = true;
    var attributeInfo = {
      capabilityId: capabilityEnergyMeter,
      attributeId: attributeEnergyMeterConsumption
    };

    var filters = {};
    filters = {
      resources: [resource],
      zoneId: this.selectedZone
    };

    var time = {
      dateRange: [this.startDate, this.endDate],
      resolution: this.resolution
    };
    await CocoAnalytics.fetchData(this.analyticsHandle, this.selectedNetwork.networkId, attributeInfo, filters, time, this.selectedMeasure).then((response: any) => {
      this.analyticsData = response;
      this.zoneResources[i].value = response.data[response.data.length - 1].value;
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
    this.spinnerService.setSpinner(false);
  }
  selectStartDate(option: any) {
    var x = this.options.filter(e => e.firstDay == option.firstDay);
    this.startMonth = x[0].label;
    if (this.startMonth != '' && this.endMonth != '') {
      this.startDate = x[0].firstDay;
      this.endDate = x[0].lastDay;
      this.run('line', 'start');
    }
  }

  selectEndDate(option: any) {
    var x = this.options.filter(e => e.firstDay == option.firstDay);
    this.endMonth = x[0].label;
    if (this.startMonth != '' && this.endMonth != '') {
      this.startDate = x[0].firstDay;
      this.endDate = x[0].lastDay;
      console.log(this.startDate);
      console.log(this.endDate);
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


