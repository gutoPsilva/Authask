import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { DisableCopyPasteDirective } from './directives/disable-copy-paste.directive';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { TaskListComponent } from './components/pages/task-list/task-list.component';
import { LoggedOutPermissionsService, PermissionsService } from './guards/auth.guard';
import { HomeComponent } from './components/pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignUpComponent,
    DisableCopyPasteDirective,
    PageNotFoundComponent,
    TaskListComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [PermissionsService, LoggedOutPermissionsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
