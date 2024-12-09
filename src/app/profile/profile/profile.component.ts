import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  activeTab: 'questions' | 'answers' | 'archive' = 'questions';
  user: any;
  allQuestions: any[] = [];
  answeredQuestions: any[] = [];

  allBadges: any = [
    { name: 'Fresher', level: 'bronze', threshold: 0 },
    { name: 'Intermediate', level: 'silver', threshold: 2 },
    { name: 'Expert', level: 'gold', threshold: 3 }
  ];
  currentBadge: any;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.user = this.databaseService.users.find(
      (user: any) => this.compareIds(user.id, this.databaseService.loggedInUserId)
    );
    this.getAllQuestions();
    this.getAnsweredQuestions();
    this.assignBadge();
  }

  compareIds(id1: string | number, id2: string | number): boolean {
    return String(id1) === String(id2);
  }

  getAllQuestions(): void {
    this.allQuestions = this.databaseService.questions;
  }

  getAnsweredQuestions(): void {
    const userAnswers = this.databaseService.answers.filter(
      (answer: any) => this.compareIds(answer.uid, this.databaseService.loggedInUserId)
    );
    
    this.answeredQuestions = this.databaseService.questions.filter(
      (question: any) => userAnswers.some((answer: any) => this.compareIds(answer.qid, question.id))
    );
  }

 

  assignBadge(): void {
    const totalContributions = this.allQuestions.length + this.answeredQuestions.length;
    this.currentBadge = this.allBadges.reduce(
      (prev: { threshold: number }, curr: { threshold: number }) =>
        totalContributions >= curr.threshold && curr.threshold > prev.threshold
          ? curr
          : prev,
      this.allBadges[0]
    );
  }

  setActiveTab(tab: 'questions' | 'answers' | 'archive'): void {
    this.activeTab = tab;
  }

  archive(id:any){
    console.log(id)
    this.databaseService.questions.find((elem:any)=>{
    if(elem.id == +id){
      elem.activeYN = 0;
    }
   });
   console.log(this.databaseService.questions)
   localStorage.setItem("questions",JSON.stringify(this.databaseService.questions));
  }

  unarchive(id:any){
    console.log(id)
    this.databaseService.questions.find((elem:any)=>{
    if(elem.id == +id){
      elem.activeYN = 1;
    }
   });
   console.log(this.databaseService.questions)
   localStorage.setItem("questions",JSON.stringify(this.databaseService.questions));
  
  }
 

  
  
}
