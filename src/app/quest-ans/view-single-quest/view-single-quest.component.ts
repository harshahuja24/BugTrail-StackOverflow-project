import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/shared/services/database.service';
import confetti from 'canvas-confetti';


@Component({
  selector: 'app-view-single-quest',
  templateUrl: './view-single-quest.component.html',
  styleUrls: ['./view-single-quest.component.css']
})
export class ViewSingleQuestComponent {
  isAuthor!:boolean
  activated_id!: any;
  answers: any[] = []; // Array to store answers for the current question
  question: any = {};  // Object to store the current question's details
  questions = this.databaseService.questions;
  downVote: any;

  phatakaCounter:number = 0;
  currentUser:any
  isClickedUp:boolean=true
  isClickedDown:boolean=true
  prevVoteCount!:any
  

  constructor(private databaseService: DatabaseService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // Get the question ID from the ActivatedRoute
    this.activatedRoute.params.subscribe(params => {
      this.activated_id = params['id'];
  
      // Fetch the question details using the question ID
      this.question = this.databaseService.questions.find((q: any) => q.id == this.activated_id);
      
      
      // if (this.question.voteCount === undefined) {
      //   this.question.voteCount = 0;
      // }
  
      this.answers = this.databaseService.answers.filter((ans: any) => ans.qid == this.activated_id);

      this.currentUser=this.databaseService.loggedInUserId
      console.log(this.currentUser)
      if(+this.currentUser>0) this.isAuthor=true
      else{  this.isAuthor=false}
      console.log(this.isAuthor)

      this.questions = this.databaseService.questions
      // this.databaseService.answers.filter((ans:any)=> ans.id == )
      // let questions=this.databaseService.questions.filter((ques:any)=> ques.authorId == currentUser)
      // console.log(questions)

      this.databaseService.answers.forEach((ans:any) => {
        console.log( ans.voteCount)
      })
 

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
      isUpVote: true,
      isDownVote:true, // Initialize votes
      voteCount:0,
      date: new Date(),
      isBest: false ,
      voters:{[this.currentUser]:{isUpvote:true,isDownVote:true}}
    };


    this.databaseService.answers.push(newAns);
    localStorage.setItem("answers", JSON.stringify(this.databaseService.answers));

    // Refresh the answer list to show the new answer
    this.answers = this.databaseService.answers.filter((ans: any) => ans.qid == this.activated_id);
    this.checkPhatakaValid()

    if(this.phatakaCounter == 3){

      this.triggerConfetti();
      
    }
    else{
      this.phatakaCounter = 0;
    }
    }

 
  voteUp(item: any) {
    // if (item.voteCount === undefined) {
    //   item.voteCount = 0;
    // }
    //   this.prevVoteCount = item.voteCount;
    // if(this.isClickedUp)  item.voteCount+=1;
    // if(item.voteCount - this.prevVoteCount==1 && this.currentUser ){
    //     this.isClickedUp=false
    //    let answer = this.databaseService.answers.find((ans:any)=> ans.id===item.id)
    //    answer.voteCount=item.voteCount
    //    localStorage.setItem("answers",JSON.stringify(this.databaseService.answers))
    // }
    // if(this.isClicked==true)  item.voteCount++;
    console.log(item.isUpVote)
    let answer = this.databaseService.answers.find((ans:any)=> ans.id===item.id)
    if(answer.isUpVote){
      this.prevVoteCount = item.voteCount;
      console.log("prevvotecount"+this.prevVoteCount)
       item.voteCount+=1;
       console.log("item.votecount"+item.voteCount)
      if(item.voteCount - this.prevVoteCount==1 && this.currentUser ){
          this.isClickedUp=false
          item.isUpVote=false
          item.isDownVote=true
        let answer = this.databaseService.answers.find((ans:any)=> ans.id===item.id)
        answer.voteCount=item.voteCount
        answer.isUpVote=item.isUpVote
        answer.isDownVote=item.isDownVote
        localStorage.setItem("answers",JSON.stringify(this.databaseService.answers))
      }
    }
  }

  voteDown(item: any) {
    let answer = this.databaseService.answers.find((ans:any)=> ans.id===item.id)
    if(answer.isDownVote && this.currentUser){
      console.log("inside downvote")
    // if (item.voteCount === undefined) {
    //   item.voteCount = 0;
    // }
          this.prevVoteCount = item.voteCount;
      
      if(this.isClickedDown && item.voteCount>0)  item.voteCount-=1;
      console.log(item.voteCount)
      // if(item.voteCount==0){
      //   if(this.prevVoteCount - item.voteCount==1 && this.currentUser ){
      //       this.isClickedDown=false
      //       item.isDownVote=false
      //   }
      // }
      item.isDownVote=false
          item.isUpVote=true
     if(item.voteCount - this.prevVoteCount==1 && this.currentUser ){
          this.isClickedDown=false
          // item.isDownVote=false
          // item.isUpVote=true
        }
      let answer = this.databaseService.answers.find((ans:any)=> ans.id===item.id)
      answer.voteCount=item.voteCount
      answer.isUpVote=item.isUpVote
      answer.isDownVote=item.isDownVote
      localStorage.setItem("answers",JSON.stringify(this.databaseService.answers))
  }
    
  }


  // vote(item:any,whichVote:number){

  // }

  checkPhatakaValid(){
    this.databaseService.answers.forEach((ans:any) => {

      if(ans.uid == +this.databaseService.loggedInUserId){
        this.phatakaCounter +=1;
        
      }
      
    });

    console.log(this.phatakaCounter)

 
  }
  
  triggerConfetti() {
    confetti({
      particleCount: 2000,
      spread: 1000,
      origin: { x: 0.5,  y: 0.5 },
    });
  }
  
 

  
  markBestAnswer(answer: any) {
    this.databaseService.answers.forEach((ans: any) => {
      ans.isBest = false;
    });
    answer.isBest = true;
  }

}
