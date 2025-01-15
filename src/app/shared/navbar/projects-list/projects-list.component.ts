import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FirebaseServiceService} from '../../../../services/firebase-service.service';
import {Project} from '../../../../modules/project';
import {User} from 'firebase/auth';
import {NavigationService} from '../../../../services/navigation.service';
import {RippleDirective} from '../../ripple.directive';

@Component({
    host: {
        '(document:click)': 'toggleMenu($event)',
    },
    selector: 'app-projects-list',
    standalone: true,
    templateUrl: './projects-list.component.html',
    styleUrl: './projects-list.component.sass',
    imports: [
        RippleDirective
    ],
    providers: [FirebaseServiceService]
})
export class ProjectsListComponent implements OnInit {
    @Input() user: User | null = null;
    @Output() openProjectModal: EventEmitter<void> = new EventEmitter<void>();

    private firebaseService = inject(FirebaseServiceService);
    private navigationService = inject(NavigationService);

    showMenu = false;
    projects: Project[] = [];
    selectedProject: Project = new Project();

    constructor(
        private _eref: ElementRef
    ) {
    }

    async ngOnInit() {
        await this.getProjects();
    }

    toggleMenu(event: Event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.showMenu = false;
        } else {
            this.showMenu = !this.showMenu;
        }
    }

    async getProjects() {
        this.projects = await this.firebaseService.getProjects(this.user!.uid);

        setTimeout(() => {
            if (location.pathname.split('/')[2]) {
                this.selectedProject = this.projects.find(p => p.id === location.pathname.split('/')[2]) || new Project();
                this.navigationService.updateSelectedProject(this.selectedProject);
            } else {
                if (this.projects.length > 0) {
                    this.selectedProject = this.projects[0];
                    // go to url
                    window.location.href = `/projects/${this.selectedProject.id}/summary`;
                } else {
                    this.selectedProject = new Project();
                }
            }
        }, 100);
    }

    updateSelectedProject(project: any) {
        this.selectedProject = project;
        // go to url
        window.location.href = `/projects/${this.selectedProject.id}/summary`;
    }

    async deleteProject(project: Project) {
        await this.firebaseService.deleteProject(project.id);
        await this.getProjects();
    }
}
