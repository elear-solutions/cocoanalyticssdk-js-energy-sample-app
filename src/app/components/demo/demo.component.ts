import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NetworkService } from 'src/app/services/network.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
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
  analyticsHandle: any;
  userDetails: any = {};
  networks: any = [];
  selectedFilter: string = "";
  selectedNetwork: any = {
    networkId: "",
    networkName: ""
  };
  searchNetworkCtrl: FormControl = new FormControl();
  showChart: boolean = false;
  submitted: boolean = false;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  // public barChartData: ChartDataSets[] = [
  //   { data: [], label: '' },
  // ];
  public barChartData: any[] = [{ data: [{}], label: '' },];

  constructor(public userService: UserService, public networkService: NetworkService, public spinnerService: SpinnerService) {
    // this.searchNetworkCtrl = new FormControl();
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
        this.tempZones = data.response.zones;
      }, (error: any) => {
        console.log('getZoneNetworkList : ', error);
        return error;
      });
  }
  resetNetworkSearch() {
    this.networks = [];
    if (this.searchNetworkCtrl != undefined) {
      this.searchNetworkCtrl.setValue("");
    }
  }
  validate() {
    if (!this.selectedNetwork.networkName || !this.selectedZone.zoneName ||
      !this.selectedCapability.capabilityName || !this.selectedGraphType || !this.resolution || !this.displayFullDate || !this.selectedMeasure) {
      this.gotoTop();
      return false;
    }
    else return true;
  }
  run() {
    this.barChartData[0].data = [{}];
    this.spinnerService.setSpinner(true);
    this.submitted = true;
    var valid = this.validate();
    if (valid) {
      var attributeInfo = {
        capabilityId: capabilityEnergyMeter,
        attributeId: attributeEnergyMeterConsumption
      };

      var filters = {};

      if (this.selectedResource.name) {
        filters = {
          resources: [{
            resourceEui: this.selectedResource.resourceEui,
            deviceNodeId: this.selectedResource.deviceNodeId,
          }],
          zoneId: this.selectedZone.zoneId
        };
      }
      else {
        filters = {
          zoneId: this.selectedZone.zoneId
        };
      }

      var time = {
        dateRange: [this.startDate, this.endDate],
        resolution: this.resolution
      };
      CocoAnalytics.fetchData(this.analyticsHandle, this.selectedNetwork.networkId, attributeInfo, filters, time, this.selectedMeasure).then((response: any) => {
        this.analyticsData = response;
        this.showChart = this.isEmpty(this.analyticsData);
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
    }
    else {
      this.spinnerService.setSpinner(false);
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


