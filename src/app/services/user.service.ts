import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { SpinnerService } from '../services/spinner.service';
declare var Coco: any;
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL: string = environment.COCO_API_URL;
  public currentUserSubject = new BehaviorSubject<User>(new User());
  currentUser = this.currentUserSubject.asObservable();

  constructor(private router: Router, private spinnerService: SpinnerService, private authService: AuthService) {
    this.baseURL = environment.COCO_API_URL;
  }
  public getUserDetails(): any {
    this.spinnerService.setSpinner(true);
    const url = this.baseURL + "/user-manager/users/me";
    return Coco.api({
      "url": url,
      "method": "GET",
      "headers": {
        'Content-Type': 'application/json; charset=utf-8'
      },
      "responseType": "json",
    }).then(
      (data: any) => {
        this.spinnerService.setSpinner(false);
        return data;
      },
      (error: any) => {
        this.spinnerService.setSpinner(false);
        if (error.response) {
          var err = error.response['error']['message'];
          console.log('Error : Get User Details', err);
        }
        this.errorHandler(error);
        return error;
      });
  }

  public logout() {
    this.spinnerService.setSpinner(true);
    Coco.logout().then((res: any) => {
      Coco.login();
    }).then(
      (data: any) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiresAt');
        localStorage.clear();
        this.authService.accessTokenSubject.next("false");
        this.spinnerService.setSpinner(false);
        return data;
      },
      (error: any) => {
        this.spinnerService.setSpinner(false);
        if (error.response) {
          var err = JSON.parse(error.response);
          console.log('Error : Logout', err.error.message);
        }
        this.errorHandler(error);
        return error;
      });
  }
  public errorHandler(error: any) {
    if (error) {
      if (error == 'Error: Session expired') { //401 Unauthorized
        Coco.login();
      }
      else if (error.status == 404) {
        this.router.navigate(['/', '404']);
      }
      else if (error.status == 500) {
        this.router.navigate(['/', '500']);
      }
      else if (error.status == 401) {
        Coco.login();
      }
    }
  }
}
