import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { SpinnerService } from './services/spinner.service';
import { User } from './models/user';
import { Router, NavigationEnd, NavigationStart, Event } from '@angular/router';
import { environment } from '../environments/environment';
import { ConnectionService } from 'ng-connection-service';

declare var Coco: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'COCO Analytics Sample App';
  status = 'ONLINE';
  isConnected = true;
  userDetails: any;
  event: any;
  results: User = new User();
  isLoggedIn: any;
  loader: any;
  isLoading: boolean = false;
  timeout: any;

  constructor(private connectionService: ConnectionService, private userService: UserService, private router: Router, public spinnerService: SpinnerService) {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
      }
      else {
        window.focus();
      }
    });
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
      }
      else {
        this.status = "OFFLINE";
      }
    });

    router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {
        // Show loading indicator
        this.isLoading = true;
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        this.timeout = setTimeout(() => {
          clearTimeout(this.timeout);
          this.isLoading = false;
        }, 1000);
      }
    });

    this.spinnerService.spinnerSubject.subscribe(data => {
      this.isLoading = data;
    });
  }

  ngOnInit() {
    if (this.status == "ONLINE") {
      Coco.init({
        client_id: environment.CLIENT_ID,
        redirect_uri: environment.REDIRECT_URL, // optional
      },
      )
        .then(() => { // No return data being captured
          console.log('Coco init API completed.');
          return Coco.isLoggedIn();

        }).then((isLoggedIn: any) => {
          this.isLoggedIn = isLoggedIn;
          if (!isLoggedIn) {
            Coco.login();
          }
        }).then(() => {
          this.userService.getUserDetails()
            .then(
              (data: { status: number; response: User; }) => {
                if (data.status != 401) {
                  console.log('Success -  user');
                  this.userService.currentUserSubject.next(data.response);
                  localStorage.setItem('coco-user', JSON.stringify(data.response));
                }
                else if (data.status == 401) {
                  Coco.login();
                }

              },
              (error: any) => {
                console.log('Error - user', error);
                return error;
              }
            );
        });
    }
  }
}

