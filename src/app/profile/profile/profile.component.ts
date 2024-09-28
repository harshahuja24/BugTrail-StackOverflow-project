import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  activeTab: 'questions' | 'answers' = 'questions';
  loggedInUserId: any;
  user: any;
  userQuestionCount: number = 0;
  questions: any[] = [];
  userAnswers: any[] = [];
  users: any = this.databaseService.users;

  allBadges: any = [
    { name: 'Fresher', level: 'bronze', threshold: 0 },
    { name: 'Intermediate', level: 'silver', threshold: 3 },
    { name: 'Expert', level: 'gold', threshold: 6 }
  ];
  currentBadge: any;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.user = this.databaseService.users.find(
      (user: any) => user.id === this.databaseService.loggedInUserId
    );
    this.countUserQuestions();
    this.assignBadge();
    this.getUserQuestions();
    this.getUserAnswers();
  }

  countUserQuestions(): void {
    this.userQuestionCount = this.databaseService.questions.filter(
      (question: any) => question.authorId === this.databaseService.loggedInUserId
    ).length;
  }

  assignBadge(): void {
    this.currentBadge = this.allBadges.reduce(
      (prev: { threshold: number }, curr: { threshold: number }) =>
        this.userQuestionCount >= curr.threshold && curr.threshold > prev.threshold
          ? curr
          : prev,
      this.allBadges[0] // Starting with the lowest badge
    );
  }

  getUserQuestions(): void {
    this.questions = this.databaseService.questions.filter(
      (question: any) => question.authorId === this.databaseService.loggedInUserId
    );
  }

  getUserAnswers(): void {
    // Assuming answers are stored in questions array
    console.log("AYYA ANS")
  }

  setActiveTab(tab: 'questions' | 'answers'): void {
    this.activeTab = tab;
  }
}
