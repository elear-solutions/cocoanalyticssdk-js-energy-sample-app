import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  userDetails: any;

  constructor(public router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(data => {
      this.userDetails = data;
    });
  }

  public logout() {
    this.userService.logout();
  }
}
