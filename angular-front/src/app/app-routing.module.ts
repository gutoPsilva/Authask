import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { TaskListComponent } from './components/pages/task-list/task-list.component';
import { AuthenticatedGuard, NotAuthenticatedGuard } from './guards/auth.guard';
import { HomeComponent } from './components/pages/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthenticatedGuard] }, // cannot be accessed when logged in
  { path: 'task-list', component: TaskListComponent, canActivate: [AuthenticatedGuard] }, // cannot be accessed when logged out
  { path: 'sign-up', component: SignUpComponent, canActivate: [NotAuthenticatedGuard] },
  { path: '404-page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404-page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
