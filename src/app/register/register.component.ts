import { Component, OnInit } from '@angular/core';

import { RegisterUser } from '../RegisterUser';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerUser: RegisterUser;
  public warning: String = null;
  public success: Boolean = false;
  public loading: Boolean = false;


  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.registerUser = new RegisterUser();
  }

  onSubmit(f: NgForm): void {
    this.loading = true;

    this.auth.register(this.registerUser).subscribe(
      (success) => {
        this.success = true;
        this.warning = null;
        this.loading = false;

        this.registerUser.userName = ' ';
      },
      (err) => {
        this.warning = err.error.message;
        this.success = false;
        this.loading = false;
      }
    );
  }

}
