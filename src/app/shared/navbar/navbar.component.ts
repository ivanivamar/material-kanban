import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FirebaseAuthServiceService} from '../../../services/firebase-auth-service.service';
import {RippleDirective} from '../ripple.directive';
import {NavigationService} from '../../../services/navigation.service';
import {ProjectsListComponent} from './projects-list/projects-list.component';
import {globalUser, setGlobalUser} from "../../../constants/enviroment";
import {User} from 'firebase/auth';
import {NgOptimizedImage} from '@angular/common';
import {UserMenuComponent} from './user-menu/user-menu.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        RippleDirective,
        ProjectsListComponent,
        NgOptimizedImage,
        UserMenuComponent
    ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
    private firebaseAuthService = inject(FirebaseAuthServiceService);
    private navigationService = inject(NavigationService);

    user: User | null = globalUser;

    ngOnInit() {
        this.firebaseAuthService.isLoggedIn().then(user => {
            if (user) {
                console.log(user);
                this.user = user;
            }
        });
    }

    updateSelectedProject(project: any) {
        this.navigationService.updateSelectedProject(project);
    }
}
