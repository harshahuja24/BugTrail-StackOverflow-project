import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  contact = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit() {
    console.log('Form submitted!', this.contact);
    // Perform further actions, like sending to backend
  }

}
