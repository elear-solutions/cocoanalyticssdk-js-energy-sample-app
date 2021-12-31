import { Injectable } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';
import { environment } from '../../environments/environment';
import { Route, Router, NavigationStart, ActivatedRoute } from '@angular/router';
// import { resolve } from 'path';
// import { rejects } from 'assert';

declare var Coco: any;

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private baseURL: string = environment.COCO_API_URL;

  constructor(private router: Router, private spinnerService: SpinnerService) {
    this.baseURL = environment.COCO_API_URL;
  }

  public getNetworksList(): any {
    this.spinnerService.setSpinner(true);
    const url = this.baseURL + "/network-manager/networks";
    return Coco.api(
      {
        "url": url,
        "method": "GET",
        "headers": {
          'Content-Type': 'application/json; charset=utf-8'
        },
        "responseType": ""
      }).then(
        (data: any) => {
          this.spinnerService.setSpinner(false);
          return data;
        },
        (error: any) => {
          this.spinnerService.setSpinner(false);
          if (error.response) {
            var err = error.response['error']['message'];
            console.log('Error :  Get Networks List', err);
          }
          // this.errorHandler(error);
          return error;
        });
  }
  public getZonesByNetwork(networkId: any) {
    this.spinnerService.setSpinner(true);
    const url = this.baseURL + "/network-manager/networks/" + networkId + "/zones";
    var accessToken = localStorage.getItem('accessToken');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.onreadystatechange = function (event) {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 400) {
            return resolve(xhr);
          } else {
            return reject(xhr);
          }
        }
      }
      xhr.open('GET', url, true)
      xhr.setRequestHeader('Content-Type', 'Application/json')
      xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken)
      xhr.withCredentials = true
      xhr.send();
    });
  }
  public getZoneNetworkList(networkId: any): any {
    this.spinnerService.setSpinner(true);
    const url = this.baseURL + "/network-manager/networks/" + networkId + "/zones";
    return Coco.api(
      {
        "url": url,
        "method": "GET",
        "headers": {
          'Content-Type': 'application/json; charset=utf-8'
        },
        "responseType": "json"
      }).then(
        (data: any) => {
          this.spinnerService.setSpinner(false);
          return data;
        },
        (error: any) => {
          this.spinnerService.setSpinner(false);
          if (error.response) {
            var err = error.response['error']['message'];
            console.log('Error : Zone Network List', err);
          }
          // this.errorHandler(error);
          return error;
        });
  }
}
