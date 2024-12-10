import { Component, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-view-all-quest',
  templateUrl: './view-all-quest.component.html',
  styleUrls: ['./view-all-quest.component.css']
})
export class ViewAllQuestComponent {

  @ViewChild(SearchComponent) searchComponent!: SearchComponent; // Reference SearchComponent to access filteredQuestions

  constructor(private databaseService : DatabaseService){}

  questions:any = []
  ngOnInit(){
   
   
  }
  
   



}
