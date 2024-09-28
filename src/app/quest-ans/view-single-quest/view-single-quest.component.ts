import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Component({
  selector: 'app-view-single-quest',
  templateUrl: './view-single-quest.component.html',
  styleUrls: ['./view-single-quest.component.css']
})
export class ViewSingleQuestComponent {
  activated_id!:any
  constructor(private databaseService : DatabaseService, private activatedRoute : ActivatedRoute){
    this.activated_id = this.activatedRoute.params
    console.log(this.activatedRoute.params);
    console.log(this.activated_id)
  }
  ngOnInit(){
    console.log(this.activated_id)
  }

  questions = this.databaseService.questions

   answerForm = new FormGroup({
    htmlContent: new FormControl(''),

  });


  config = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter quest description here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      { name: "quote", class: "quote" },
      { name: 'redText', class: 'redText' },
      { name: "titleText", class: "titleText", tag: "h1" }
    ]
  };
  abc!:any
  onSubmit(){

    const formVals = this.answerForm.value;
    const newAns = {
      id:++this.databaseService.ansCounter,
      qid : this.activated_id["_value"].id,
      description: formVals.htmlContent,
      uid: this.databaseService.loggedInUserId,
      
    }
    // console.log(qid)

    console.log(newAns)
   
     
  }
}
