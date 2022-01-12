import { Component, OnChanges, Input, ViewChild } from "@angular/core";
import { Label, SingleDataSet, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { SpinnerService } from 'src/app/services/spinner.service';
declare var CocoAnalytics: any;
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-resources-in-zones-chart',
  templateUrl: './resources-in-zones-chart.component.html',
  styleUrls: ['./resources-in-zones-chart.component.scss']
})
export class ResourcesInZonesChartComponent implements OnChanges {
  @ViewChild('rules_resourcesModal') rules_resourcesModal: ModalDirective | undefined;
  @Input()
  timeResolution!: string;
  @Input()
  selectedZone: any;
  @Input()
  attributeInfo: any = {};
  @Input()
  filters: any = {};
  @Input()
  time: any = {};
  @Input()
  networkId: any;
  @Input()
  analyticsHandle: any;
  @Input()
  measure: any;
  @Input()
  resources: any[] = [{}];
  @Input()
  dataset!: { data: string | any[]; };
  @Input()
  graphType!: string;
  @Input()
  doughnutAnalyticsData: any;
  showChart: boolean = false;
  showEnergyConsumedByResources: boolean = false;

  public chartData: SingleDataSet = [];
  alertThreshold = 3500;
  selectedResource: any = {};
  selectedResourceName: any;
  analyticsData: any;
  errorMessage: any;
  selectedResourceId: any;
  endDate: string = "";
  startDate: string = "";
  dateRange: any;
  showIndividualResource: boolean = false;
  constructor(public spinnerService: SpinnerService) { }

  ngOnChanges(): void {
    console.log(this.resources);
  }

  setTimeResolution(resolution: string) {
    this.time.resolution = resolution;
    this.dateRange = Utils.getDateRange(resolution);
    this.fetchAnalyticsDataForIndividualResource(this.selectedResource);
  }


  showIndividualResourceModal(resource: any) {
    this.showIndividualResource = false;
    this.selectedResourceId = resource.resourceEUIId;
    this.selectedResourceName = resource.name;

    this.selectedResource = {
      resourceEui: resource.resourceEui,
      deviceNodeId: resource.deviceNodeId,
    };

    this.showIndividualResource = true;
    if (this.rules_resourcesModal) {
      this.filters.zoneId = this.selectedZone;
      this.rules_resourcesModal.show();
      this.fetchAnalyticsDataForIndividualResource(this.selectedResource);
    }

  }

  async fetchAnalyticsDataForIndividualResource(resource: any) {
    this.spinnerService.setSpinner(true);
    if (this.startDate != '' && this.endDate != '') {
      this.time.dateRange = [this.dateRange.startDate, this.dateRange.endDate];
    }
    await CocoAnalytics.fetchData(this.analyticsHandle, this.networkId, this.attributeInfo, this.filters, this.time, this.measure).then((response: any) => {
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
    console.log("fetchAnalyticsDataForIndividualResource NETWORK ID: ", this.networkId, " ATTRIBUTE INFO: ", this.attributeInfo," FILTERS: ", this.filters, " TIME:", this.time, "analyticsData ", this.analyticsData);
    this.spinnerService.setSpinner(false);
  }
}
