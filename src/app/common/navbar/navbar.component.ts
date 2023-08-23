import { Component, OnInit } from '@angular/core';
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

    projects: Project[] = [];
    projectName = '';
    projectId = '';
    showProjectsList = false;
    searchTerm = '';

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
        this.isLogin = window.location.pathname === '/auth/login';
        this.isRegister = window.location.pathname === '/auth/register';

        // check if user is logged in
        this.authService.isLoggedIn().then((user: any) => {
            if (user) {
                this.user = user;
                this.userImage = user.photoURL;
            }
        });

        from(this.kanbanService.getProjects()).subscribe((projects: any[]) => {
            this.projects = projects;

            // filter projects by user uid
            this.projects = this.projects.filter((project: Project) => {
                return project.uid === this.user.uid;
            });

            // order projects by order property
            this.projects.sort((a: Project, b: Project) => {
                return a.order - b.order;
            });
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

    navigateToProject(project: Project) {
        this.showProjectsList = false;
        this.searchTerm = '';
        this.router.navigate(['/projects/kanban'], {
            queryParams: {projectId: project.id},
        }).then(); // empty then to avoid error
    }
}
