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
  activated_id!: any;
  answers: any[] = []; // Array to store answers for the current question
  question: any = {};  // Object to store the current question's details
  questions = this.databaseService.questions;

  constructor(private databaseService: DatabaseService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // Get the question ID from the ActivatedRoute
    this.activatedRoute.params.subscribe(params => {
      this.activated_id = params['id'];

      // Fetch the question details using the question ID
      this.question = this.databaseService.questions.find((q: any) => q.id == this.activated_id);

      // Fetch the answers related to the question
      this.answers = this.databaseService.answers.filter((ans: any) => ans.qid == this.activated_id);
    });
  }

  answerForm = new FormGroup({
    htmlContent: new FormControl(''),
  });

  config = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter answer here...',
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

  onSubmit() {
    const formVals = this.answerForm.value;
    const newAns = {
      id: ++this.databaseService.ansCounter,
      qid: this.activated_id,
      description: formVals.htmlContent,
      uid: this.databaseService.loggedInUserId,
      upVote: 0,
      downVote:0, // Initialize votes
      date: new Date(),
      isBest: false // Track best answer
    };

    // Save the new answer
    this.databaseService.answers.push(newAns);
    localStorage.setItem("answers", JSON.stringify(this.databaseService.answers));

    // Refresh the answer list to show the new answer
    this.answers = this.databaseService.answers.filter((ans: any) => ans.qid == this.activated_id);
  }

  upvote(item: any) {
    item.upvote++;
  }

  downvote(item: any) {
    item.downVote++;
  }

  markBestAnswer(answer: any) {
    this.databaseService.answers.forEach((ans: any) => {
      ans.isBest = false;
    });
    answer.isBest = true;
  }
}
