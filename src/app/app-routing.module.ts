import { Register } from './interfaces/Kanban.interfaces';
import { ProjectsComponent } from './projects/projects.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailsComponent } from './kanban-board/project-details.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent,
        pathMatch: 'full',
    },
    {
        path: 'projects/kanban',
        component: ProjectDetailsComponent,
        pathMatch: 'full',
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
