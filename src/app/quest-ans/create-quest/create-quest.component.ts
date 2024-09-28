// // import { Component } from '@angular/core';
// // import { AngularEditorConfig } from '@kolkov/angular-editor/lib/config';
// // import { DatabaseService } from 'src/app/shared/services/database.service';

// // @Component({
// //   selector: 'app-create-quest',
// //   templateUrl: './create-quest.component.html',
// //   styleUrls: ['./create-quest.component.css']
// // })
// // export class CreateQuestComponent {
// //   questTitle = '';
// //   htmlContent = '';
// //   constructor( private databaseService : DatabaseService){}
// //  tags = this.databaseService.tags

// //   config: AngularEditorConfig = {
// //     editable: true,
// //     spellcheck: true,
// //     height: '15rem',
// //     minHeight: '5rem',
// //     placeholder: 'Enter quest description here...',
// //     translate: 'no',
// //     defaultParagraphSeparator: 'p',
// //     defaultFontName: 'Arial',
// //     toolbarHiddenButtons: [
// //       ['bold']
// //     ],
// //     customClasses: [
// //       {
// //         name: "quote",
// //         class: "quote",
// //       },
// //       {
// //         name: 'redText',
// //         class: 'redText'
// //       },
// //       {
// //         name: "titleText",
// //         class: "titleText",
// //         tag: "h1",
// //       },
// //     ]
// //   };

// //   onSubmit() {
// //     console.log({
// //       title: this.questTitle,
// //       description: this.htmlContent,
// //       tags: this.getSelectedTags()
// //     });

// //     this.databaseService.questions

// //   }

// //   getSelectedTags(): string[] {
// //     return this.tags.filter(tag => tag.selected).map(tag => tag.name);
// //   }

// // }

// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AngularEditorConfig } from '@kolkov/angular-editor/lib/config';
// import { DatabaseService } from 'src/app/shared/services/database.service';

// @Component({
//   selector: 'app-create-quest',
//   templateUrl: './create-quest.component.html',
//   styleUrls: ['./create-quest.component.css']
// })
// export class CreateQuestComponent {
//   createQuestForm: FormGroup; 
//    // FormGroup to manage the form
//   tags = this.databaseService.tags;

//   config: AngularEditorConfig = {
//     editable: true,
//     spellcheck: true,
//     height: '15rem',
//     minHeight: '5rem',
//     placeholder: 'Enter quest description here...',
//     translate: 'no',
//     defaultParagraphSeparator: 'p',
//     defaultFontName: 'Arial',
//     toolbarHiddenButtons: [
//       ['bold']
//     ],
//     customClasses: [
//       {
//         name: 'quote',
//         class: 'quote',
//       },
//       {
//         name: 'redText',
//         class: 'redText'
//       },
//       {
//         name: 'titleText',
//         class: 'titleText',
//         tag: 'h1',
//       },
//     ]
//   };

//   constructor(private fb: FormBuilder, private databaseService: DatabaseService) {
//     this.createQuestForm = this.fb.group({
//       questTitle: ['', Validators.required],
//       htmlContent: ['', Validators.required],
//       tags: this.fb.array([])  // Will hold selected tags
//     });
//   }

//   onSubmit() {
//     if (this.createQuestForm.valid) {
//       const formValues = this.createQuestForm.value;
//       const newQuestion = {
//         title: formValues.questTitle,
//         description: formValues.htmlContent,
//         tags: this.getSelectedTags()
//       };

//       // Add new question to the databaseService questions array
//       this.databaseService.questions.push(newQuestion);

//       // Save the questions array to localStorage
//       localStorage.setItem('questions', JSON.stringify(this.databaseService.questions));

//       console.log('Question created and saved:', newQuestion);
//     } else {
//       console.error('Form is invalid');
//     }
//   }

//   getSelectedTags(): string[] {
//     return this.tags.filter(tag => tag.selected).map(tag => tag.name);
//   }
// }

import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/shared/services/database.service';

@Component({
  selector: 'app-create-quest',
  templateUrl: './create-quest.component.html',
  styleUrls: ['./create-quest.component.css']
})
export class CreateQuestComponent {
  createQuestForm: FormGroup;
  tags = this.databaseService.tags

  constructor(private databaseService: DatabaseService) {
    this.createQuestForm = new FormGroup({
      questTitle: new FormControl('', Validators.required),
      htmlContent: new FormControl(''),
      tags: new FormControl([])
    });
  }

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

  onSubmit() {
    if (this.createQuestForm.valid) {
      const formValues = this.createQuestForm.value;
      const newQuestion = {
        title: formValues.questTitle,
        description: formValues.htmlContent,
        tags: this.getSelectedTags()
      };

      this.databaseService.questions.push(newQuestion);
      localStorage.setItem("questions", JSON.stringify(this.databaseService.questions));

      console.log('Question created and saved:', newQuestion);
    } else {
      console.error('Form is invalid');
    }
  }

  getSelectedTags(): string[] {
    return this.databaseService.tags.filter(tag => tag.selected).map(tag => tag.name);
  }
}
