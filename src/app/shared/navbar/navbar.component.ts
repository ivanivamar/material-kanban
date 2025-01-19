import {Component, computed, inject, OnInit, signal, Signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FirebaseAuthServiceService} from '../../../services/firebase-auth-service.service';
import {RippleDirective} from '../ripple.directive';
import {NavigationService} from '../../../services/navigation.service';
import {User} from 'firebase/auth';
import {NgOptimizedImage} from '@angular/common';
import {UserMenuComponent} from './user-menu/user-menu.component';
import {ProjectModalComponent} from '../project-modal/project-modal.component';
import {TaskModalComponent} from '../task-modal/task-modal.component';
import {Select, SelectChangeEvent} from 'primeng/select';
import {Project} from '../../../modules/project';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {FormsModule} from '@angular/forms';
import {Drawer} from 'primeng/drawer';
import {SidebarComponent} from './sidebar/sidebar.component';
import {NavbarTaskModalComponent} from './navbar-task-modal/navbar-task-modal.component';

@Component({
    selector: 'app-navbar',
    imports: [
        RouterLink,
        RouterLinkActive,
        RippleDirective,
        NgOptimizedImage,
        UserMenuComponent,
        ProjectModalComponent,
        TaskModalComponent,
        Select,
        FormsModule,
        Drawer,
        SidebarComponent,
        NavbarTaskModalComponent
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
    private firebaseAuthService = inject(FirebaseAuthServiceService);
    private firebaseService = inject(FirebaseServiceService);
    private navigationService = inject(NavigationService);

    loading = false;
    user: User | null = null;

    projects: Project[] = [];
    selectedProject: Project | null = null;

    showDrawer = false;

    constructor(
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.firebaseAuthService.isLoggedIn().then(user => {
            if (user) {
                // check if user is already in local storage
                const localUser = localStorage.getItem('user');

                if (!localUser) {
                    localStorage.setItem('user', JSON.stringify(user));
                }

                this.user = user;

                this.manageProjects()
            }
        });

        this.navigationService.currentRefreshProjects.subscribe(() => {
            this.manageProjects();
        });
    }

    async getProjects() {
        this.loading = true;
        this.projects = await this.firebaseService.getProjects(this.user!.uid);
    }

    manageProjects() {
        this.getProjects().then(() => {
            if (location.pathname.split('/')[2]) {
                this.selectedProject = this.projects.find(p => p.id === location.pathname.split('/')[2]) || new Project();
                this.navigationService.updateSelectedProject(this.selectedProject);
            } else {
                if (this.projects.length > 0) {
                    this.selectedProject = this.projects[0];
                    this.router.navigate([`/projects/${this.selectedProject.id}/summary`]);
                } else {
                    this.selectedProject = new Project();
                }
            }
            this.loading = false;
        });
    }

    updateSelectedProject(event: SelectChangeEvent) {
        this.selectedProject = event.value;
        // get current project tab
        const currentTab = location.pathname.split('/')[3];
        this.router.navigate([`/projects/${this.selectedProject!.id}/${currentTab}`]);
        this.navigationService.updateSelectedProject(this.selectedProject!);
    }
}
