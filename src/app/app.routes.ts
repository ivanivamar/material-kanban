import { Routes } from '@angular/router';
import {FirebaseAuthServiceService} from '../services/firebase-auth-service.service';
import {AuthenticateComponent} from './authenticate/authenticate.component';
import {ProjectSummaryComponent} from './projects/project-summary/project-summary.component';
import {ProjectBoardComponent} from './projects/project-board/project-board.component';
import {ProjectListComponent} from './projects/project-list/project-list.component';

export const routes: Routes = [
    {
        path: 'authenticate',
        component: AuthenticateComponent,
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: 'projects/:id/summary',
        pathMatch: 'full'
    },
    {
        path: 'projects/:id/summary',
        component: ProjectSummaryComponent,
        pathMatch: 'full',
        canActivate: [FirebaseAuthServiceService]
    },
    {
        path: 'projects/:id/board',
        component: ProjectBoardComponent,
        pathMatch: 'full',
        canActivate: [FirebaseAuthServiceService]
    },
    {
        path: 'projects/:id/list',
        component: ProjectListComponent,
        pathMatch: 'full',
        canActivate: [FirebaseAuthServiceService]
    },
];
