import { Register } from './interfaces/Kanban.interfaces';
import { KanbanDashboardComponent } from './kanban-dashboard/kanban-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
    {
        path: '',
        component: KanbanDashboardComponent,
        pathMatch: 'full',
        ...canActivate(() => redirectUnauthorizedTo(['auth/login'])),
    },
    {
        path: 'projects',
        component: ProjectsComponent,
        pathMatch: 'full',
        ...canActivate(() => redirectUnauthorizedTo(['auth/login'])),
    },
    {
        path: 'projects/kanban',
        component: KanbanBoardComponent,
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
