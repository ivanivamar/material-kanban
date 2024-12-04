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
        path: 'projects',
        component: ProjectsComponent,
        pathMatch: 'full',
        canActivate: [FirebaseAuthServiceService]
    },
    {
        path: 'projects/:id',
        component: ProjectsComponent,
        pathMatch: 'full',
        canActivate: [FirebaseAuthServiceService]
    },
    {
        path: 'projects/:project-id/task/:task-id',
        component: TaskDetailsComponent,
        pathMatch: 'full',
        canActivate: [FirebaseAuthServiceService]
    },
];
