import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { ViewAllQuestComponent } from './quest-ans/view-all-quest/view-all-quest.component';
import { ViewSingleQuestComponent } from './quest-ans/view-single-quest/view-single-quest.component';
import { CreateQuestComponent } from './quest-ans/create-quest/create-quest.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ErrorComponent } from './home/error/error.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'all',
    component:ViewAllQuestComponent
  },
  {
    path:'single/:id',
    component:ViewSingleQuestComponent
  },
  {
    path:'create',
    component:CreateQuestComponent
  },
  {
    path:'profile',
    component:ProfileComponent
  },
  {
    path:'**',
    component:ErrorComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
