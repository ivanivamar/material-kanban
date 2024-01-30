import { KanbanService } from 'src/shared/services/kanban-service.service';
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
    Task,
    Urgency,
    Checkboxes,
} from '../../interfaces/Kanban.interfaces';
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
    loading = false;
    currentProjectId: string = '';

    user: any;

    profileExpanded = false;
    constructor(
        private router: Router,
        private authService: AuthService,
        ) { }

    async ngOnInit(): Promise<void> {
        this.loading = true;

        // check if user is logged in
        this.authService.isLoggedIn().then((user: any) => {
            if (user) {
                this.user = user;
                this.loading = false;
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
