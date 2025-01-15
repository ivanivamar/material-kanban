import { Routes } from '@angular/router';
import {FirebaseAuthServiceService} from '../services/firebase-auth-service.service';
import {AuthenticateComponent} from './authenticate/authenticate.component';
import {ProjectsComponent} from './projects/projects.component';
import {TaskDetailsComponent} from './projects/task-details/task-details.component';

export const routes: Routes = [
    {
        path: 'authenticate',
        component: AuthenticateComponent,
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
    },
    {
        path: 'projects/:id/summary',
        component: ProjectsComponent,
        pathMatch: 'full',
        canActivate: [FirebaseAuthServiceService]
    },
    {
        path: 'projects/:id/board',
        component: ProjectsComponent,
        pathMatch: 'full',
        canActivate: [FirebaseAuthServiceService]
    },
    {
        path: 'projects/:id/list',
        component: ProjectsComponent,
        pathMatch: 'full',
        canActivate: [FirebaseAuthServiceService]
    },
];
