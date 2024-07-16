import { Register } from './interfaces/Kanban.interfaces';
import { ProjectsComponent } from './projects/projects.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import {AuthService} from "../shared/services/auth.service";
import {TaskComponent} from "./project-details/project-details-tasks/task/task.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',
    },
    {
        path: 'projects',
        component: ProjectsComponent,
        pathMatch: 'full',
        canActivate: [AuthService]
    },
    {
        path: 'projects/:id',
        component: ProjectDetailsComponent,
        pathMatch: 'full',
        canActivate: [AuthService]
    },
    {
        path: 'projects/:id/overview',
        component: ProjectDetailsComponent,
        pathMatch: 'full',
        canActivate: [AuthService]
    },
    {
        path: 'projects/:id/tasks',
        component: ProjectDetailsComponent,
        pathMatch: 'full',
        canActivate: [AuthService]
    },
    {
        path: 'projects/:id/tasks/:taskId',
        component: TaskComponent,
        pathMatch: 'full',
        canActivate: [AuthService]
    },
    {
        path: 'projects/:id/members',
        component: ProjectDetailsComponent,
        pathMatch: 'full',
        canActivate: [AuthService]
    },
    {
        path: 'projects/:id/settings',
        component: ProjectDetailsComponent,
        pathMatch: 'full',
        canActivate: [AuthService]
    },
    {
        path: 'auth',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth/register',
        component: RegisterComponent,
        pathMatch: 'full',
    },
    {
        path: 'auth/login',
        component: LoginComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
