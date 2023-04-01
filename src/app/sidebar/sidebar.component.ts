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
} from '../interfaces/Kanban.interfaces';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent {
    projects: any[] = [];
    loading = false;
    currentProjectId: string = '';

    constructor(private kanbanService: KanbanService, private router: Router) { }

    async ngOnInit(): Promise<void> {
        this.loading = true;

        from(this.kanbanService.getProjects()).subscribe((projects: any[]) => {
            this.projects = projects;
            this.loading = false;
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
