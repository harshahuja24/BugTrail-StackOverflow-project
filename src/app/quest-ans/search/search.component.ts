import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../shared/services/database.service'; // Assuming you have a service to fetch questions

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm: string = ''; // Stores the search input value
  filteredQuestions: any[] = []; // Stores the filtered questions

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    // Initialize with all questions before any search
    this.filteredQuestions = this.databaseService.questions;
  }

  // Method to filter questions based on the search term
  searchQuestions() {
    if (this.searchTerm) {
      this.filteredQuestions = this.databaseService.questions.filter((question:any) =>
        question.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // If no search term, reset to show all questions
      this.filteredQuestions = this.databaseService.questions;
    }
  }
}
