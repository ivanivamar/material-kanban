import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FirebaseAuthServiceService} from '../../../services/firebase-auth-service.service';
import {RippleDirective} from '../ripple.directive';
import {NavigationService} from '../../../services/navigation.service';
import {ProjectsListComponent} from './projects-list/projects-list.component';
import {User} from 'firebase/auth';
import {NgOptimizedImage} from '@angular/common';
import {UserMenuComponent} from './user-menu/user-menu.component';
import {ProjectModalComponent} from '../project-modal/project-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        RippleDirective,
        ProjectsListComponent,
        NgOptimizedImage,
        UserMenuComponent,
        ProjectModalComponent
    ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
    private firebaseAuthService = inject(FirebaseAuthServiceService);
    private navigationService = inject(NavigationService);

    user: User | null = null;

    ngOnInit() {
        this.firebaseAuthService.isLoggedIn().then(user => {
            if (user) {
                // check if user is already in local storage
                const localUser = localStorage.getItem('user');

                if (!localUser) {
                    localStorage.setItem('user', JSON.stringify(user));
                }

                this.user = user;
            }
        });
    }

    updateSelectedProject(project: any) {
        this.navigationService.updateSelectedProject(project);
    }
}
