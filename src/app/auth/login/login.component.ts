import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


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
    console.log(users);
    
    // Initialize as not valid
    this.isValidLogin = false;

    for (let user of users) {
      // Check for username and password match
      if (user.username === username && user.password === password) {
        // If a match is found, update activeYN and set isValidLogin to true
        this.isValidLogin = true;
        this.loggedInUserId = user.id;
        user.activeYN = 1; // Update activeYN for the matched user
        break; // Exit the loop since we found the user
      }
    }

    // If a valid login was found, proceed to update local storage and navigate
    if (this.isValidLogin) {
      // Update the database service with the logged-in user's details
      this.databaseService.loggedInUserId = this.loggedInUserId;
      
      // Save the updated users back to local storage
      localStorage.setItem("users", JSON.stringify(users));

      // Navigate to the main page or dashboard
      this.router.navigate(['']);
    } else {
      console.log('Invalid login');
    }
}

}