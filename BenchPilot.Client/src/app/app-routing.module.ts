import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmailInboxComponent } from './components/email-inbox/email-inbox.component';
import { ConsultantManagementComponent } from './components/consultant-management/consultant-management.component';
import { JobRequirementsComponent } from './components/job-requirements/job-requirements.component';
import { AiMatchingComponent } from './components/ai-matching/ai-matching.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'emails', component: EmailInboxComponent },
  { path: 'consultants', component: ConsultantManagementComponent },
  { path: 'jobs', component: JobRequirementsComponent },
  { path: 'matching', component: AiMatchingComponent },
  { path: 'submissions', component: DashboardComponent }, // Placeholder
  { path: 'notifications', component: DashboardComponent }, // Placeholder
  { path: 'settings', component: DashboardComponent }, // Placeholder
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }