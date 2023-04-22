import { KanbanService } from 'src/app/kanban-service.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import {
    Firestore,
    collectionData,
    collection,
    addDoc,
    deleteDoc,
    doc,
    DocumentData,
    updateDoc,
    arrayUnion,
} from '@angular/fire/firestore';
import {
    Project,
    Column,
    Task,
    Urgency,
    Checkboxes,
} from '../../interfaces/Kanban.interfaces';
import { AuthService } from '../../auth.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.sass'],
    providers: [KanbanService, AuthService],
})
export class SidebarComponent {
    projects: any[] = [];
    loading = false;
    currentProjectId: string = '';

    user: any;

    constructor(
        private kanbanService: KanbanService,
        private router: Router,
        private authService: AuthService,
        ) { }

    async ngOnInit(): Promise<void> {
        this.loading = true;

        // check if user is logged in
        this.authService.isLoggedIn().then((user: any) => {
            if (user) {
                this.user = user;

                from(this.kanbanService.getProjects()).subscribe((projects: any[]) => {
                    this.projects = projects;
                    // filter projects by user uid
                    this.projects = this.projects.filter((project) => {
                        return project.uid === this.user.uid;
                    });
                    this.loading = false;
                });
            }
        });

        // get current project id from url
        this.router.routerState.root.queryParams.subscribe((params) => {
            this.currentProjectId = params['projectId'];
        });
    }

    navigateTo(projectId: string): void {
        this.router.navigate(['/kanban'], {
            queryParams: { projectId: projectId },
        });
    }
}
