import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Component({
  selector: 'app-view-all-quest',
  templateUrl: './view-all-quest.component.html',
  styleUrls: ['./view-all-quest.component.css']
})
export class ViewAllQuestComponent {

  constructor(private databaseService : DatabaseService){}

  questions:any = []
  ngOnInit(){

     this.questions = this.databaseService.questions

   
  }
  
   



}
