import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
// import { ComposerService } from 'src/app/services/composer.service';
// import cubejs from '@cubejs-client/core';
// import WebSocketTransport from '@cubejs-client/ws-transport';
import { interval } from 'rxjs';
import { map, filter, distinctUntilChanged, pairwise, takeUntil } from 'rxjs/operators';
import { TabsetComponent, MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
@Component({
  selector: 'app-chart-demo',
  templateUrl: './chart-demo.component.html',
  styleUrls: ['./chart-demo.component.scss']
})
export class ChartDemoComponent implements OnInit {
  // @ViewChild('staticTabZones', { static: false }) staticTabZones: TabsetComponent;
  selectedFilter: any = "Hourly";
  @Output() activeTab: any = new EventEmitter<number>();

  compareDateRange = [
    ['2021-06-01', '2021-06-30'],
    ['2021-07-01', '2021-07-31'],
  ];

  public totalHomeConsumptionQuery = {};
  public energyConsumptionByZonesQuery = {};
  public monthlyConsumptionComparisonQuery = {};
  public currentEnergyConsumedQuery = {};

  //Chart 2
  public zonesAndResourcesConsumedQuery = {};

  networkId: any = "5eb99586c46daa001080a30c";
  zones: any = [];
  selectedZone: any = "12388244331b7100161111zz";
  // resources:any=[];
  selectedMainTab: any = 0;
  selectedZoneTab: any = 0;

  resources = {
    "12388244331b7100161111zz": ["3/zigbee/3C6A2CFFFED0AEFA/01"],
    "12388244331b7100161111zf": ["3/zigbee/14B457FFFE003619/01"],
    "12388244331b7100161111zw": ["3/zigbee/14B457FFFE002ECC/01", "3/zigbee/3C6A2CFFFED0AEE2/01"],
    "12388244331b7100161111zq": ["3/zigbee/3C6A2CFFFED0AEB2/01", "3/zigbee/3C6A2CFFFED0827A/01", "3/zigbee/3C6A2CFFFED05755/01"],
    "12388244331b7100161111aa": ["3/zigbee/3C6A2CFFFED0AF76/01"]
  };
  energyMeterResourceId = "3/zigbee/3C6A2CFFFED0827A/01";

  constructor(private composerService: ComposerService) { }

  ngOnInit() {
  }

  init() {
    this.getTotalHomeConsumption();
    this.getEnergyConsumedByZones();
    this.getMonthlyComparisons();
    this.getCurrentEnergyConsumed();
    this.getZonesByNetworkId();
  }

  initPage1() {
    this.getTotalHomeConsumption();
    this.getEnergyConsumedByZones();
  }
  initPage2() {
    this.getZoneAndResourcesConsumed();
  }

  getZoneAndResourcesConsumed() {
    if (this.selectedFilter == "Hourly") {
      this.zonesAndResourcesConsumedQuery =
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
          "EnergyDemandWatt.hourlyEnergyDemandKWh": "desc"
        },
        "dimensions": [
          "EnergyDemandWatt.resourceEui"
        ],
        "filters": [
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          },
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "equals",
            "values":
              this.resources[this.selectedZone]
          }
        ]
      }
    }

    else if (this.selectedFilter == 'Daily') {

      this.zonesAndResourcesConsumedQuery =

      {
        "measures": [
          "EnergyDemandWatt.dailyEnergyDemandKWh"
        ],
        "timeDimensions": [
          {
            "dimension": "EnergyDemandWatt.energyTime",
            "dateRange": "Today"
          }
        ],
        "order": {
          "EnergyDemandWatt.dailyEnergyDemandKWh": "desc"
        },
        "dimensions": [
          "EnergyDemandWatt.resourceEui"
        ],
        "filters": [
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          },
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "equals",
            "values":
              this.resources[this.selectedZone]
          }
        ]
      }
    }

    // this.showChart = true;


    else if (this.selectedFilter == 'Monthly') {
      this.zonesAndResourcesConsumedQuery =
      {
        "measures": [
          "EnergyDemandWatt.monthlyEnergyDemandKWh"
        ],
        "timeDimensions": [
          {
            "dimension": "EnergyDemandWatt.energyTime",
            "dateRange": "This Month"
          }
        ],
        "order": {
          "EnergyDemandWatt.hourlyEnergyDemandKWh": "desc"
        },
        "dimensions": [
          "EnergyDemandWatt.resourceEui"
        ],
        "filters": [
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          },
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "equals",
            "values":
              this.resources[this.selectedZone]
          }
        ]
      }
    }
    this.composerService.setZoneAndResourceConsumedSubscriptionDetails(this.zonesAndResourcesConsumedQuery);

  }

  onZoneClick(zoneId, i) {

    if (zoneId != undefined) {
      this.selectedZone = zoneId;
      this.selectedZoneTab = parseInt(i) + 1;
      if (this.selectedZone == zoneId) {
        this.initPage2();
      }
    }
  }



  getZonesByNetworkId() {
    this.zones = [
      {
        "zoneId": '12388244331b7100161111zz',
        "zoneName": "Bedroom",
      },
      {
        "zoneId": '12388244331b7100161111zf',
        "zoneName": "Master Bedroom",
      },
      {
        "zoneId": '12388244331b7100161111zw',
        "zoneName": "Kitchen",
      },
      {
        "zoneId": '12388244331b7100161111zq',
        "zoneName": "Living Room",
      },
      {
        "zoneId": '12388244331b7100161111aa',
        "zoneName": "Master Bathroom"
      }
    ]
    this.selectedZone = "12388244331b7100161111zz";
  }

  selectMainActiveTab(event) {
    if (event != undefined) {
      this.selectedMainTab = event.activeTabIndex;

      if (event.activeTabIndex == 0) {
        this.selectedZone = "";
        this.init();
      }
      else if (event.activeTabIndex == 1) {

      }
      else if (event.activeTabIndex == 2) {
      }
    }

  }

  setCompareDateRange(event) {
    this.compareDateRange = event;
    this.getMonthlyComparisons();
  }

  getCurrentEnergyConsumed() {
    this.currentEnergyConsumedQuery =
    {
      "measures": [
        "EnergyDemandWatt.currentEnergyDemandKWh"
      ],
      "timeDimensions": [
        {
          "dimension": "EnergyDemandWatt.energyTime"
        }
      ],
      "order": {
        "EnergyDemandWatt.energyTime": "asc"
      },
      "dimensions": [],
      "filters": [
        {
          "member": "EnergyDemandWatt.networkId",
          "operator": "equals",
          "values": [
            this.networkId
          ]
        },
        {
          "member": "EnergyDemandWatt.resourceEui",
          "operator": "equals",
          "values": [
            this.energyMeterResourceId
          ]
        }
      ]
    }
    this.composerService.setHalfDoughnutChartSubscriptionDetails(this.currentEnergyConsumedQuery);
  }

  getMonthlyComparisons() {
    this.monthlyConsumptionComparisonQuery =
    {
      "measures": [
        "EnergyDemandWatt.monthlyEnergyDemandKWh"
      ],
      "timeDimensions": [
        {
          "dimension": "EnergyDemandWatt.energyTime",
          "compareDateRange": this.compareDateRange,
          "granularity": "day",
        }
      ],
      "order": {},
      "dimensions": [],
      "filters": [
        {
          "member": "EnergyDemandWatt.networkId",
          "operator": "equals",
          "values": [
            this.networkId
          ]
        },
        {
          "member": "EnergyDemandWatt.resourceEui",
          "operator": "equals",
          "values": [
            this.energyMeterResourceId
          ]
        }
      ]
    }
    this.composerService.setLineChartSubscriptionDetails(this.monthlyConsumptionComparisonQuery);

  }

  getTotalHomeConsumption() {
    if (this.selectedFilter == "Hourly") {
      this.totalHomeConsumptionQuery =
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
        "order": {},
        "dimensions": [],
        "filters": [
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          },
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "equals",
            "values": [
              this.energyMeterResourceId
            ]
          }
        ]
      }
    }
    else if (this.selectedFilter == 'Daily') {

      this.totalHomeConsumptionQuery =
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
        "order": {},
        "dimensions": [],
        "filters": [
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          },
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "equals",
            "values": [
              this.energyMeterResourceId
            ]
          }
        ]
      }
    }
    else if (this.selectedFilter == 'Monthly') {
      this.totalHomeConsumptionQuery =
      {
        "measures": [
          "EnergyDemandWatt.monthlyEnergyDemandKWh"
        ],
        "timeDimensions": [
          {
            "dimension": "EnergyDemandWatt.energyTime",
            "granularity": "month",
            "dateRange": "This Year"
          }
        ],
        "order": {},
        "dimensions": [],
        "filters": [
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          },
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "equals",
            "values": [
              this.energyMeterResourceId
            ]
          }
        ]
      }
    }

    this.composerService.setBarChartSubscriptionDetails(this.totalHomeConsumptionQuery);
  }

  getEnergyConsumedByZones() {//pAGE 1 QUERY
    if (this.selectedFilter == "Hourly") {
      this.energyConsumptionByZonesQuery =
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
          "EnergyDemandWatt.hourlyEnergyDemandKWh": "desc"
        },
        "dimensions": [
          "EnergyDemandWatt.resourceEui"
        ],
        "filters": [
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          },
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "notEquals",
            "values": [
              this.energyMeterResourceId
            ]
          }
        ]
      }
    }
    else if (this.selectedFilter == "Daily") {
      this.energyConsumptionByZonesQuery =
      {
        "measures": [
          "EnergyDemandWatt.dailyEnergyDemandKWh"
        ],
        "timeDimensions": [
          {
            "dimension": "EnergyDemandWatt.energyTime",
            "dateRange": "Today"
          }
        ],
        "order": {
          "EnergyDemandWatt.dailyEnergyDemandKWh": "desc"
        },
        "dimensions": [
          "EnergyDemandWatt.resourceEui"
        ],
        "filters": [
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          },
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "notEquals",
            "values": [
              this.energyMeterResourceId
            ]
          }
        ]
      }
    }
    else if (this.selectedFilter == "Monthly") {
      this.energyConsumptionByZonesQuery =
      {
        "measures": [
          "EnergyDemandWatt.monthlyEnergyDemandKWh"
        ],
        "timeDimensions": [
          {
            "dimension": "EnergyDemandWatt.energyTime",
            "dateRange": "This Month"
          }
        ],
        "order": {
          "EnergyDemandWatt.monthlyEnergyDemandKWh": "desc"
        },
        "dimensions": [
          "EnergyDemandWatt.resourceEui"
        ],
        "filters": [
          {
            "member": "EnergyDemandWatt.networkId",
            "operator": "equals",
            "values": [
              this.networkId
            ]
          },
          {
            "member": "EnergyDemandWatt.resourceEui",
            "operator": "notEquals",
            "values": [
              this.energyMeterResourceId
            ]
          }
        ]
      }
    }
    this.composerService.setDoughnutChartSubscriptionDetails(this.energyConsumptionByZonesQuery);
  }

  getChartQuery(timePeriod) {
    this.selectedFilter = timePeriod;
    //set active tab of zones
    if (this.selectedMainTab == 0) {
      this.totalHomeConsumptionQuery = {};
      this.energyConsumptionByZonesQuery = {};
      this.initPage1();
    }
    else if (this.selectedMainTab == 1) {
      this.zonesAndResourcesConsumedQuery = {};
      this.initPage2();

    }
  }
}
