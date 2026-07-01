import { Routes } from '@angular/router';
import {HomePage} from "./components/home/home.page";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/login/register/register.component";
import {ResetPasswordComponent} from "./components/login/reset-password/reset-password.component";
import {ForgotPasswordComponent} from "./components/login/forgot-password/forgot-password.component";
import {SuccessComponent} from "./components/login/success/success.component";
import {AccountComponent} from "./components/account/account.component";
import {CalendarComponent} from "./components/calendar/calendar.component";
import {MembershipComponent} from "./components/membership/membership.component";
import {FeedComponent} from "./components/feed/feed.component";
import {MembersComponent} from "./components/members/members.component";
import {AddNewPostComponent} from "./components/addNewPost/addNewPost.component";
import {authGuard} from "./services/guards/auth-guard";
import {rootGuard} from "./services/guards/root-guard";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'success', component: SuccessComponent },
  { path: '', component: LoginComponent, canActivate: [rootGuard] },
  { path: 'home', component: HomePage, canActivate: [authGuard] },
  { path: 'feed', component: FeedComponent, canActivate: [authGuard] },
  { path: 'profile', component: AccountComponent, canActivate: [authGuard] },
  { path: 'membership', component: MembershipComponent, canActivate: [authGuard] },
  { path: 'members', component: MembersComponent, canActivate: [authGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [authGuard] },
  { path: 'add-new-post', component: AddNewPostComponent, canActivate: [authGuard] }
];
