import { Component, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NetworkService } from 'src/app/services/network.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { FormControl } from '@angular/forms';
import { COCOHomeIcons } from 'src/app/utils/coco_home_icons';
import { Utils } from 'src/app/utils/utils';
import { debounceTime, } from 'rxjs/operators';
declare var CocoAnalytics: any;
declare var Coco: any;
import { Network } from 'src/app/models/user';

//Capability and Attribute Settings
const capabilityEnergyMeter: number = 4;
const attributeEnergyMeterConsumption: number = 0;

@Component({
  selector: 'app-total-home-consumption',
  templateUrl: './total-home-consumption.component.html',
  styleUrls: ['./total-home-consumption.component.scss']
})

export class TotalHomeConsumptionComponent implements AfterViewInit {
  errorMessage: string = "";
  analyticsData: any = {};
  groupByZoneAnalyticsData: any = {};
  groupByResourceAnalyticsData: any = {};
  analyticsHandle: any;
  doughnutAnalyticsData: any = {};
  lineAnalyticsData: any = [];
  tempStartMonth: any = {};
  tempEndMonth: any = {};
  resolution: any = "";
  userDetails: any = {};
  networks: any[] = [];
  resources: any[] = [];
  zoneResources: any[] = [];
  // selectedNetwork: any = {
  //   networkId: "",
  //   networkName: ""
  // };
  selectedNetwork: Network = new Network();
  zones: any[] = [];
  selectedZone: any;
  searchNetworkCtrl: FormControl = new FormControl();
  submitted: boolean = false;
  attributeInfo: any = {
    capabilityId: capabilityEnergyMeter,
    attributeId: attributeEnergyMeterConsumption
  };
  filters: any = {};
  time: any = {};
  lineDate: any;
  startDate: any = ""; //yy//mm/dd
  endDate: any = "";
  tempZones: any;
  startMonth: string = "";
  endMonth: string = "";
  selectedMeasure: any;

  //Graphs
  showTotalHomeConsumption: boolean = false;
  showEnergyConsumedByZones: boolean = false;
  showMonthlyComparisons: boolean = false;
  showCurrentEnergyConsumed: boolean = false;

  //Hard Coded values for Line Chart Comparisons
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
  tempNetworks: any;

  constructor(public userService: UserService, public networkService: NetworkService, public spinnerService: SpinnerService) {
  }

  ngAfterViewInit() {
    this.userService.currentUser.subscribe((data: Object) => {
      if (data != null) {
        //Get User Details
        this.userDetails = data;

        //Get List of Networks
        this.networkService.getNetworksList().then((res: any) => {
          this.networks = res.response.networks;
          this.tempNetworks = this.networks;
        });
      }
    });

    this.searchNetworkCtrl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
        var tempArray: any[] = [];
        if (data != null) {
          this.tempNetworks.filter(function (network: any) {
            if (network.networkName.toLowerCase().indexOf(data.toLowerCase()) >= 0) {
              tempArray.push(network);
            }
            else {
              // alert("val does not exists");
            }
          });
        }
        this.networks = [];
        this.networks = tempArray;
      });

    //Get access token and connect to CubeJS to get the analyticsHandle
    Coco.getAccessToken().then(
      (data: any) => {
        var accessToken = data;
        CocoAnalytics.connect(accessToken).then((data: any) => {
          this.analyticsHandle = data;
        });
      }
    )
  }

  // //Get List of Networks
  // getNetworksList() {
  //   this.networkService.getNetworksList().then((res: any) => {
  //     this.networks = res.response.networks;
  //     this.tempNetworks = res.response.networks;
  //   })
  // }

  //On Selecting a network
  selectNetwork(network: any) {
    var old_val = this.selectedNetwork.networkId;
    if (old_val != network.networkId) {
      this.analyticsData = {};
      this.selectedNetwork = network;
      // this.selectedNetwork.networkId = network.networkId;
      // this.selectedNetwork.networkName = network.networkName;
      // this.selectedNetwork.categoryName = network.categoryName;
      this.showCurrentEnergyConsumed = true; //Show graph current energy consumed
      this.getNetworkZones();
    }
  }

  //Get List of Zones By Network Id
  getNetworkZones() {
    this.networkService.getZoneNetworkList(this.selectedNetwork.networkId).then(
      (data: any) => {
        this.zones = data.response.zones;
        this.selectedZone = this.zones[0].zoneId;
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

  //Get Resources by zone id
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
      this.setDefaultDatesForMonthlyComparison();
    }, 500);
  }

  setDefaultDatesForMonthlyComparison() {
    this.selectStartDate(this.options[8]);
    setTimeout(() => {
      this.selectEndDate(this.options[9]);
    }, 500);
  }

  //Set startDate and End Date for Monthly Comparisons for start month
  selectStartDate(option: any) {
    var x = this.options.filter(e => e.firstDay == option.firstDay);
    this.startMonth = x[0].label;
    this.startDate = x[0].firstDay;
    this.endDate = x[0].lastDay;
    this.setObjectForMonthlyComparisons('startMonth');
  }

  //Set startDate and End Date for Monthly Comparisons for end month
  selectEndDate(option: any) {
    var x = this.options.filter(e => e.firstDay == option.firstDay);
    this.endMonth = x[0].label;
    this.startDate = x[0].firstDay;
    this.endDate = x[0].lastDay;
    this.setObjectForMonthlyComparisons('endMonth');
  }

  setObjectForMonthlyComparisons(mode: string) {
    this.filters = {};
    this.filters = {
      resources: this.resources,
      zoneId: ''
    };
    this.time = {
      dateRange: [this.startDate, this.endDate],
      resolution: 'Daily'
    };
    this.fetchAnalyticsDataForMonthlyComparisons(mode);
  }

  fetchAnalyticsDataForMonthlyComparisons(mode: string) {
    this.showMonthlyComparisons = true;
    this.lineDate = mode;
    this.spinnerService.setSpinner(true);
    this.submitted = true;

    CocoAnalytics.fetchData(this.analyticsHandle, this.selectedNetwork.networkId, this.attributeInfo, this.selectedMeasure, this.time, this.filters).then((response: any) => {
      if (mode == 'startMonth') {
        this.tempStartMonth = response;
      }
      else {
        this.tempEndMonth = response;
      }

      if (Utils.isEmpty(this.tempStartMonth) == false && Utils.isEmpty(this.tempEndMonth) == false) {
        this.lineAnalyticsData = [];
        this.lineAnalyticsData.push(this.tempStartMonth);
        this.lineAnalyticsData.push(this.tempEndMonth);
      }
      this.spinnerService.setSpinner(false);
    }, (error: any) => {
      this.spinnerService.setSpinner(false);
      Utils.gotoTop();
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
    console.log(this.lineAnalyticsData);
    this.lineAnalyticsData = {};
    this.spinnerService.setSpinner(false);
  }

  //Get Resources by zone id
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
          this.fetchAnalyticsDataForIndividualResource(x, i);
        }
        console.log(this.zoneResources);
      }, (error: any) => {
        console.log('getResourceZoneList : ', error);
        return error;
      });
  }

  //On click of a zone
  selectZone(zoneId: any, i: any) {
    if (zoneId != undefined) {
      alert("slect zone");
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

  //To DO
  resetGraphs1() {
    this.showTotalHomeConsumption = false;
    this.showEnergyConsumedByZones = false;
    this.showTotalHomeConsumption = true;
    this.showEnergyConsumedByZones = false;
  }

  setTimeResolution(resolution: string) {
    this.resetGraphs1();
    this.resolution = resolution;
    this.setDates();
  }

  setDates() {
    var date = new Date();
    if (this.resolution == "Hourly") {
      this.endDate = date.toISOString().split('.')[0];
      this.startDate = Utils.getRelativeHours(24);
      this.fetchAnalyticsData();
      this.groupData("Zone");
      this.groupData("Resource");
    }
    else if (this.resolution == "Daily") {
      this.endDate = date.toISOString().split('.')[0];
      this.startDate = Utils.getRelativeDays(30);
      this.fetchAnalyticsData();
      this.groupData("Zone");
      this.groupData("Resource");
    }
    else if (this.resolution == "Monthly") {
      this.endDate = date.toISOString().split('.')[0];
      this.startDate = Utils.getRelativeMonths(12);
      this.fetchAnalyticsData();
      this.groupData("Zone");
      this.groupData("Resource");
    }
  }

  fetchAnalyticsData() {
    this.spinnerService.setSpinner(true);
    this.submitted = true;

    this.filters = {};
    this.filters = {
      resources: this.resources,
      zoneId: ""
    };

    this.time = {
      dateRange: [this.startDate, this.endDate],
      resolution: this.resolution
    };
    CocoAnalytics.fetchData(this.analyticsHandle, this.selectedNetwork.networkId, this.attributeInfo, this.selectedMeasure, this.time, this.filters).then((response: any) => {
      this.analyticsData = response;
      this.spinnerService.setSpinner(false);
    }, (error: any) => {
      this.spinnerService.setSpinner(false);
      Utils.gotoTop();
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

  groupData(groupBy: string) {
    this.showEnergyConsumedByZones = true;
    this.spinnerService.setSpinner(true);
    this.submitted = true;

    this.filters = {};
    this.filters = {
      resources: this.resources,
      zoneId: groupBy == 'Resource' ? this.selectedZone : ''
    };

    this.time = {
      dateRange: [this.startDate, this.endDate],
      resolution: this.resolution
    };
    CocoAnalytics.groupData(this.analyticsHandle, this.selectedNetwork.networkId, this.attributeInfo, this.selectedMeasure, this.time, groupBy, this.filters).then((response: any) => {
      if (groupBy == 'Zone') {
        this.groupByZoneAnalyticsData = response;
      }
      else {
        this.groupByResourceAnalyticsData = response;
      }

      this.spinnerService.setSpinner(false);
    }, (error: any) => {
      this.spinnerService.setSpinner(false);
      Utils.gotoTop();
      this.errorMessage = error;
      setTimeout(() => {
        this.errorMessage = "";
      }, 5000);
    });

    console.log("group by ANALYTICS HANDLE");
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
    this.groupByZoneAnalyticsData = {};

    this.spinnerService.setSpinner(false);
  }

  async fetchAnalyticsDataForIndividualResource(resource: any, i: number) {
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
      Utils.gotoTop();
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
}


