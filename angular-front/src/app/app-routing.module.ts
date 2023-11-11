import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { TaskListComponent } from './components/pages/task-list/task-list.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'task-list', component: TaskListComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '404_page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404_page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
