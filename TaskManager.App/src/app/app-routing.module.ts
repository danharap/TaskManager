import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AdminComponent } from './Components/admin/admin.component';
import { SettingsComponent} from './Components/settings/settings.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { AnalyticsDashboardComponent } from './Components/analytics-dashboard/analytics-dashboard.component';
import { SubtaskBoardComponent } from './Components/subtask-board/subtask-board.component';
import { AnimationsComponent} from './Components/animations/animations.component'
import { NotificationsComponent} from './Components/notifications/notifications.component';
import { HelpComponent } from './Components/help/help.component';
import { DeveloperDocsComponent } from './Components/developer-docs/developer-docs.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'admin/tasks', component: AdminComponent }, 
  { path: 'admin/users', component: AdminComponent },
  { path: 'analytics', component: AnalyticsDashboardComponent }, 
  { path: 'tasks/:id/subtasks', component: SubtaskBoardComponent },
  { path: 'animations', component: AnimationsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'help', component: HelpComponent },
  { path: 'developer-docs', component: DeveloperDocsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }