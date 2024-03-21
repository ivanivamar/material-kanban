import { KanbanService } from 'src/shared/services/kanban-service.service';
import {Component, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: [
        '../../../styles.sass',
        './sidebar.component.sass'
    ],
    providers: [KanbanService, AuthService],
})
export class SidebarComponent {
    showUserMenu = false;

    user: any;
    constructor(
        private router: Router,
        private authService: AuthService,
        ) { }

    // check when scroll down
    @HostListener('window:scroll', ['$event.target'])
    onScroll(event: any) {
        if (event.scrollingElement.scrollTop > 170) {
            // @ts-ignore
            document.getElementById('navbar').classList.add('navbar-fixed');
        } else {
            // @ts-ignore
            document.getElementById('navbar').classList.remove('navbar-fixed');
        }
    }

    async ngOnInit(): Promise<void> {

        // check if user is logged in
        this.authService.isLoggedIn().then((user: any) => {
            if (user) {
                this.user = user;
            }
        });
    }

    logout() {
        this.authService.logout()
            .then(() => {
                this.router.navigate(['']);
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }).catch((error) => {
                console.log('error', error);
            });
    }

    navigateTo(projectId: string): void {
        this.router.navigate(['/kanban'], {
            queryParams: { projectId: projectId },
        });
    }
}
