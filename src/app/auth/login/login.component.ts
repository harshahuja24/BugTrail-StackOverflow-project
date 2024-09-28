import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{


  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });
  isValidLogin:boolean = true;
  loggedInUserId!: any;
  
  constructor(private router:Router, private databaseService: DatabaseService){

  }


  ngOnInit() {
    // this.validateLogin()
    this.subscribeToUsernameAndPassword();
  }

  submit() {
    console.log(this.loginForm.value);
    this.validateLogin()
    this.loginForm.reset();
  }

  subscribeToUsernameAndPassword() {
    let name = this.loginForm.get('username')?.valueChanges.subscribe((username) => {username} );
    let password = this.loginForm.get('password')?.valueChanges.subscribe((password) => password);

    
  }

  validateLogin() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    let users = JSON.parse(localStorage.getItem("users") ?? "[]");
    console.log(users)
    for (let user of users) {
      if (user.username !== username || user.password !== password) {

        this.isValidLogin = false;
        
      }
      else{
        this.isValidLogin = true;
        this.loggedInUserId=user.id
        user.activeYN=1
        break
      }
    
    }
      if(this.isValidLogin){
        this.databaseService.loggedInUserId = this.loggedInUserId;
        localStorage.setItem("loggedInUserId", this.loggedInUserId.toString())
        console.log(this.databaseService.users)
        localStorage.setItem("users",JSON.stringify(this.databaseService.users))
        this.router.navigate([''])
      }

  }

}