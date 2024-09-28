import { Injectable } from '@angular/core';
import { Tags } from '../interfaces/tags.interface';
import { Question } from '../interfaces/question.interface';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  questions:any = JSON.parse(localStorage.getItem("questions") ?? "[]")
  users:any = JSON.parse(localStorage.getItem("users") ?? "[]")
  userCounter:number = this.users.length;

  loggedInUserId = localStorage.getItem("loggedInUserId") ?? "";

  tags:Tags[] = [
    {
      id:1,
      name:'JavaScript',
      subTag: ['promises', 'ajax', 'hoisting'],
      selected: false
    },
    {
      id:2,
      name:'TypeScript',
      subTag: ['interfaces', 'alias', 'object and classes']
      ,
      selected: false
    },
    {
      id:3,
      name:'Java',
      subTag: ['inheritance', 'Polymorph', 'OOP']
      ,
      selected: false
    },
  ]
}
