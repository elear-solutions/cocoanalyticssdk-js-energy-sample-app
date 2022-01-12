import * as moment from "moment";
import { NetworkService } from 'src/app/services/network.service';
import { Injectable } from '@angular/core';
  //Hard Coded values for Line Chart Comparisons
  export const Options = [
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

@Injectable({
  providedIn: 'root'
})
export class Utils {
  constructor(public networkService: NetworkService) {
  }
  static getRelativeHours(hr: any) {
    var date = new Date();
    var relativeDateTime = moment(date).subtract('hours', hr); //to get the date object
    return relativeDateTime.toISOString().split('.')[0]; //In UTC
  }

  static getRelativeDays(day: any) {
    var date = new Date();
    var relativeDateTime = moment(date).subtract('day', day);//to get the date object
    return relativeDateTime.toISOString().split('.')[0]; //In UTC
  }

  static getRelativeMonths(month: any) {
    var date = new Date();
    var relativeDateTime = moment(date).subtract('month', month); //to get the date object
    return relativeDateTime.toISOString().split('.')[0]; //In UTC
  }

  static convertUTCDateToLocalDate(date: string | number | Date) {
    var d = new Date(date);
    var time = d.getTime();
    var offset = d.getTimezoneOffset() * 60 * 1000;
    var nd = time - offset;
    var newDate = new Date(nd);
    return newDate;
  }

  static convertMilitaryTimeToStandardTime(time: any) {
    var splitTime = time.split(':');
    var _hrs = splitTime[0];
    var _mins = splitTime[1];

    if (parseInt(_hrs) > 12) {
      _hrs = (parseInt(_hrs) - 12).toString();
      if (parseInt(_hrs) < 10) {
        // _hrs=("0"+_hrs).toString();
      }
      return _hrs + ":" + _mins + " pm";
    }
    else if (parseInt(_hrs) < 12 && parseInt(_hrs) != 0) {
      if (parseInt(_hrs) < 10) {
        // _hrs=("0"+_hrs).toString();
      }
      return _hrs + ":" + _mins + " am";
    }
    else if (parseInt(_hrs) == 12) {
      return "12:00 pm";
    }
    else if (parseInt(_hrs) == 0) {
      return "12:00 am";
    }
    else {
      return "";
    }
  }

  static isEmpty(obj: any) {
    if (Object.keys(obj).length == 0) {
      return true;
    }
    else {
      return false;
    }
  }

  //Scroll to the top of the screen
  static gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  static getDateRange(resolution: string) {
    var date = new Date();
    let startDate:any;
    let endDate:any;
    if (resolution == "Hourly") {
      endDate = date.toISOString().split('.')[0];
      startDate = this.getRelativeHours(24);
    }
    else if (resolution == "Daily") {
      endDate = date.toISOString().split('.')[0];
      startDate = this.getRelativeDays(30);
    }
    else if (resolution == "Monthly") {
      endDate = date.toISOString().split('.')[0];
      startDate = this.getRelativeMonths(12);
    }
    return {startDate: startDate, endDate: endDate};
  }

  //Get List of Zones By Network Id
  public getNetworkResources(networkId: string) {
    var zones: any[] = [];
    var tempZones: any[] =[];
    var defaultData: any[] = [];
    var resources: any[] = [];
    // getting Zones in a network
    this.networkService.getZoneNetworkList(networkId)
      .then((data: any) => {
        tempZones = data.response.zones;
        var arr = [];
        for (var i = 0; i < zones.length; i++) {
          arr.push(0);
        }
        defaultData = arr;
      }, (error: any) => {
        console.log('getZoneNetworkList : ', error);
        return error;
      }).then(() =>{
        // extracting resources for each zone
        for (var i = 0; i < tempZones.length; i++) {
          zones.push(tempZones[i]);
          this.networkService.getResourcesByZone(networkId, tempZones[i].zoneId)
            .then((data: any) => {
              for (var i = 0; i < data.response.resources.length; i++) {
                resources.push({
                  resourceEui: data.response.resources[i].resourceEui,
                  deviceNodeId: data.response.resources[i].deviceNodeId,
                })
              }
              console.log(resources);
          }, (error: any) => {
            console.log('getResourceZoneList : ', error);
            return error;
          });
        }
      });
      console.log(zones, defaultData);
      return {resources: resources, zones: zones, defaultData: defaultData}
  }
}
