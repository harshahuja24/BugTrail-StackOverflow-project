import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  isValidPassword = true;
  isValidUsername = true;


  constructor(private databaseService:DatabaseService, private router:Router){

  }
  ngOnInit(){ 
    this.subscribeToPasswordChange()
    this.subscribeToUsername()
    
  }

  registerForm = new FormGroup({

    username: new FormControl('',[Validators.required, Validators.minLength(5),Validators.maxLength(15)]),
    password: new FormControl('',[Validators.required,Validators.minLength(5)]),
    confirmPassword: new FormControl('',[Validators.required,Validators.minLength(5)]),
    email: new FormControl('',[Validators.email, Validators.required]),
    dob: new FormControl('',[Validators.required]),
    bio: new FormControl('',[Validators.maxLength(100)])

  })

  getControl(key:string){
    return this.registerForm.get(key)
  }

  subscribeToPasswordChange(){

    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(()=> this.checkPassword() )
    this.registerForm.get('password')?.valueChanges.subscribe(()=> this.checkPassword())

  }

  subscribeToUsername(){
     this.registerForm.get('username')?.valueChanges.subscribe((value:any)=> this.checkUsername(value))
  }
  checkUsername(value:any){
    this.isValidUsername = true;
    let users = JSON.parse(localStorage.getItem("users")?? "[]");
    console.log(users);
    for( let user of users){
      if(user.username === value){
        this.isValidUsername = false;
        break;
      }
    }
    
  }

    
  checkPassword(){
    this.isValidUsername = true
   let password = this.registerForm.get('password')?.value;
   let confirmPassword = this.registerForm.get('confirmPassword')?.value;

   if(password !== confirmPassword){
    this.isValidPassword=false
   }
   else
   {
    this.isValidPassword = true
   }
  }

  submit(){
    console.log(this.registerForm.value)
    this.databaseService.userCounter++;
    let users={
      ...this.registerForm.value,
      id: this.databaseService.userCounter,
      activeYN:0
    }
    this.databaseService.users.push(users)

    // Local storage needs key and value both as string..!
    localStorage.setItem("users",JSON.stringify(this.databaseService.users))
    this.registerForm.reset();
    this.router.navigate(['/login'])
  }







  

  subscribeToUsername(){
     this.registerForm.get('username')?.valueChanges.subscribe((value:any)=> this.checkUsername(value))
  }
  checkUsername(value:any){
    this.isValidUsername = true;
    let users = JSON.parse(localStorage.getItem("users")?? "[]");
    console.log(users);
    for( let user of users){
      if(user.username === value){
        this.isValidUsername = false;
        break;
      }
    }
    
  }

    
  checkPassword(){
    this.isValidUsername = true
   let password = this.registerForm.get('password')?.value;
   let confirmPassword = this.registerForm.get('confirmPassword')?.value;

   if(password !== confirmPassword){
    this.isValidPassword=false
   }
   else
   {
    this.isValidPassword = true
   }
  }

  submit(){
    console.log(this.registerForm.value)
    this.databaseService.userCounter++;
    let users={
      ...this.registerForm.value,
      id: this.databaseService.userCounter,
      activeYN:0
    }
    this.databaseService.users.push(users)

    // Local storage needs key and value both as string..!
    localStorage.setItem("users",JSON.stringify(this.databaseService.users))
    this.registerForm.reset();
    this.router.navigate(['/login'])
  }



}