import { Component, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NetworkService } from 'src/app/services/network.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { FormControl } from '@angular/forms';
import { COCOHomeIcons } from 'src/app/utils/coco_home_icons';
import { Utils, Options } from 'src/app/utils/utils';
import { debounceTime, } from 'rxjs/operators';
declare var CocoAnalytics: any;
declare var Coco: any;

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
  selectedNetwork: any = {
    networkId: "",
    networkName: ""
  };
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
  options = Options;
  dateRange: any = {};
  networkData: any = {};

  //Graphs
  showTotalHomeConsumption: boolean = false;
  showEnergyConsumedByZones: boolean = false;
  showMonthlyComparisons: boolean = false;
  showCurrentEnergyConsumed: boolean = false;
  tempNetworks: any;

  constructor(public userService: UserService, public networkService: NetworkService, public spinnerService: SpinnerService, public utils: Utils) {
  }

  ngAfterViewInit() {
    this.userService.currentUser.subscribe((data: Object) => {
      if (data != null) {
        //Get User Details
        this.userDetails = data;
        //Get List of Networks
        this.getNetworksList();
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
          });
        }
        this.networks = [];
        this.networks = tempArray;
      });

    //Get access token and connect to coco analytics to get the analyticsHandle
    Coco.getAccessToken().then(
      (data: any) => {
        var accessToken = data;
        CocoAnalytics.connect(accessToken).then((data: any) => {
          this.analyticsHandle = data;
        });
      }
    )
  }

  // Get List of Networks
  getNetworksList() {
    this.networkService.getNetworksList().then((res: any) => {
      this.networks = res.response.networks;
      this.tempNetworks = res.response.networks;
    })
  }

  //On Selecting a network
  selectNetwork(network: any) {
    var currentNetwork = this.selectedNetwork.networkId;
    if (currentNetwork != network.networkId) {
      this.analyticsData = {};
      this.selectedNetwork.networkId = network.networkId;
      this.selectedNetwork.networkName = network.networkName;
      this.selectedNetwork.categoryName = network.categoryName;
      this.showCurrentEnergyConsumed = true; //Show graph current energy consumed
      this.networkData = this.utils.getNetworkResources(this.selectedNetwork.networkId);
      this.zones = this.networkData.zones;
      this.resources = this.networkData.resources;
      this.tempZones = this.networkData.zones;
      this.doughnutAnalyticsData.data = this.networkData.defaultData;
      this.selectedZone = (this.zones.length - 1);
      setTimeout(() => {
        this.setDefaultDatesForMonthlyComparison();
      }, 500);
    }
  }

  setDefaultDatesForMonthlyComparison() {
    setTimeout(() => {
      this.selectStartDate(this.options[8]);
    }, 500);
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
      zoneId: ""
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

    CocoAnalytics.fetchData(this.analyticsHandle, this.selectedNetwork.networkId, this.attributeInfo, this.filters, this.time, this.selectedMeasure).then((response: any) => {
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

    console.log("fetchAnalyticsDataForMonthlyComparisons NETWORK ID: ", this.selectedNetwork.networkId, " ATTRIBUTE INFO: ", this.attributeInfo," FILTERS: ", this.filters, " TIME:", this.time);
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
    this.showEnergyConsumedByZones = true;
  }

  setTimeResolution(resolution: string) {
    this.resetGraphs1();
    this.resolution = resolution;
    this.dateRange = Utils.getDateRange(resolution);
    console.log("Date Range: ", this.dateRange);
    this.fetchAnalyticsData();
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
      dateRange: [this.dateRange.startDate, this.dateRange.endDate],
      resolution: this.resolution
    };
    CocoAnalytics.fetchData(this.analyticsHandle, this.selectedNetwork.networkId, this.attributeInfo, this.filters, this.time, this.selectedMeasure).then((response: any) => {

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

    console.log("fetchAnalyticsData NETWORK ID: ", this.selectedNetwork.networkId, " ATTRIBUTE INFO: ", this.attributeInfo," FILTERS: ", this.filters, " TIME:", this.time);
    this.analyticsData = {};

    this.spinnerService.setSpinner(false);
  }

  async fetchAnalyticsDataForIndividualResource(resource: any, i: number) {
    this.spinnerService.setSpinner(true);
    this.submitted = true;
    var filters = {};
    filters = {
      resources: [resource],
      zoneId: this.selectedZone
    };
    var time = {
      dateRange: [this.startDate, this.endDate],
      resolution: this.resolution
    };
    await CocoAnalytics.fetchData(this.analyticsHandle, this.selectedNetwork.networkId, this.attributeInfo, filters, time, this.selectedMeasure)
      .then((response: any) => {
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
    console.log("fetchAnalyticsDataForIndividualResource NETWORK ID: ", this.selectedNetwork.networkId, " ATTRIBUTE INFO: ", this.attributeInfo," FILTERS: ", this.filters, " TIME:", this.time);
    this.spinnerService.setSpinner(false);
  }
}
