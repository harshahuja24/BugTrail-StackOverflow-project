import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestComponent } from './create-quest/create-quest.component';
import { ViewAllQuestComponent } from './view-all-quest/view-all-quest.component';
import { ViewSingleQuestComponent } from './view-single-quest/view-single-quest.component';
import { VotingComponent } from './voting/voting.component';
import { SearchComponent } from './search/search.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CreateQuestComponent,
    ViewAllQuestComponent,
    ViewSingleQuestComponent,
    VotingComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    CreateQuestComponent,
    ViewAllQuestComponent,
    ViewSingleQuestComponent,
    VotingComponent,
    SearchComponent 
  ]
})
export class QuestAnsModule { }
