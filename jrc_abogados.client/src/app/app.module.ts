import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ClientListComponent } from './client-list/client-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { CreateCaseComponent } from './create-case/create-case.component';
import { CaseListComponent } from './case-list/case-list.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { CreateReminderComponent } from './create-reminder/create-reminder.component';
import { ReminderListComponent } from './reminder-list/reminder-list.component';
import { AuthInterceptor } from './services/AuthInterceptor';
import { authGuard } from './services/AuthGuard';
import { loginGuard } from './services/login-guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    CreateClientComponent,
    ClientListComponent,
    CreateUserComponent,
    UserListComponent,
    CreateCaseComponent,
    CaseListComponent,
    CreateAppointmentComponent,
    AppointmentListComponent,
    CreateReminderComponent,
    ReminderListComponent,
  ],
  imports: [
    RecaptchaModule,
    RecaptchaFormsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [authGuard] },
      { path: 'login', component: LoginComponent, pathMatch: 'full', canActivate: [loginGuard] },
      { path: 'client-list', component: ClientListComponent, canActivate: [authGuard] },
      { path: 'user-list', component: UserListComponent, canActivate: [authGuard] },
      { path: 'case-list', component: CaseListComponent, canActivate: [authGuard] },
      { path: 'appointment-list', component: AppointmentListComponent, canActivate: [authGuard] },
      { path: 'reminder-list', component: ReminderListComponent, canActivate: [authGuard] },
    ]),
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
