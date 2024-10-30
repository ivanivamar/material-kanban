import { Routes } from '@angular/router';
import {FirebaseAuthServiceService} from '../services/firebase-auth-service.service';
import {AuthenticateComponent} from './authenticate/authenticate.component';
import {ProjectsComponent} from './kanban/projects/projects.component';

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
        path: 'project/:id',
        component: ProjectsComponent,
        pathMatch: 'full',
        canActivate: [FirebaseAuthServiceService]
    },
];
