/*********************************************************************************
* WEB422 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
* Name: _Phuong Thuy Hoang_______ Student ID: __141035196 ___ Date: __Apr 11, 2021___
********************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web422-a4';
  searchString: string = "";

  public token: any;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) { // only read the token on "NavigationStart"
        this.token = this.auth.readToken();
      }
    });
  }

  handleSearch() {
    this.router.navigate(['/search'], { queryParams: { q: this.searchString }} );
    this.searchString= "";
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login'] );
  }

}
