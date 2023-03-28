import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
    ProjectWithId,
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

    constructor(private firestore: Firestore, private router: Router) { }

    async ngOnInit(): Promise<void> {
        this.loading = true;
        this.getProjects().subscribe((projects: any[]) => {
            console.log(projects);
            this.projects = projects;
            // add router link to each project
            this.projects.forEach((project: any) => {
                project.link = '?projectId=${project.id}';
            });
            this.loading = false;
        });

        // get current project id from url
        this.router.routerState.root.queryParams.subscribe((params) => {
            this.currentProjectId = params['projectId'];
        });
    }
    getProjects(): Observable<any[]> {
        const projectRef = collection(this.firestore, 'projects');
        return collectionData(projectRef, { idField: 'id' }) as Observable<
            any[]
        >;
    }

    navigateTo(projectId: string): void {
        this.router.navigate(['/dashboard/kanban'], {
            queryParams: { projectId: projectId },
        });
    }
}
