import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Project } from 'src/app/interfaces/Kanban.interfaces';
import { KanbanService } from 'src/app/kanban-service.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.sass'],
    providers: [KanbanService, AuthService],
})
export class NavbarComponent implements OnInit {
    isLogin = false;
    isRegister = false;
    projectName = '';
    projectId = '';

    user: any;
    userImage = '';

    profileExpanded = false;

    constructor(
        private kanbanService: KanbanService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.isLogin = window.location.pathname === '/auth/login' ? true : false;
        this.isRegister = window.location.pathname === '/auth/register' ? true : false;

        // check if user is logged in
        this.authService.isLoggedIn().then((user: any) => {
            if (user) {
                this.user = user;
                this.userImage = user.photoURL;
            }
        });

        // get project name by getting projectId from url and then call kanbanService.getProjectById(projectId)
        this.route.queryParams.subscribe(params => {
            if (params != null || params['projectId'] != null) {
                this.projectId = params['projectId'];
                from(this.kanbanService.getProjectById(this.projectId)).subscribe((project: Project) => {
                    setTimeout(() => {
                        this.projectName = project.title;
                    }, 200);
                });
            } else {
                this.projectName = '';
                this.projectId = '';
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
}
