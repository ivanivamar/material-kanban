import { Register } from './interfaces/Kanban.interfaces';
import { ProjectsComponent } from './projects/projects.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

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
        ...canActivate(() => redirectUnauthorizedTo(['auth/login'])),
    },
    {
        path: 'projects/:id',
        component: ProjectDetailsComponent,
        pathMatch: 'full',
        ...canActivate(() => redirectUnauthorizedTo(['auth/login'])),
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
