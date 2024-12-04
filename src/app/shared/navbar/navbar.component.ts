import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FirebaseAuthServiceService} from '../../../services/firebase-auth-service.service';
import {RippleDirective} from '../ripple.directive';
import {NavigationService} from '../../../services/navigation.service';
import {ProjectsListComponent} from './projects-list/projects-list.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        RippleDirective,
        ProjectsListComponent
    ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
    private firebaseAuthService = inject(FirebaseAuthServiceService);
    private navigationService = inject(NavigationService);

    origin: any = null;

    ngOnInit() {
        this.navigationService.currentOrigin.subscribe(origin => {
            this.origin = origin;
        });
    }

    updateSelectedProject(project: any) {
        this.navigationService.updateSelectedProject(project);
    }

    logout() {
        this.firebaseAuthService.logout().then(r => {
            window.location.reload();
        })
    }
}
