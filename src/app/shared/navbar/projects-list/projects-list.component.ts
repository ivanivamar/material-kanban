import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FirebaseServiceService} from '../../../../services/firebase-service.service';
import {Project} from '../../../../modules/project';
import {User} from 'firebase/auth';
import {ProjectModalComponent} from '../../project-modal/project-modal.component';
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
        RippleDirective,
        ProjectModalComponent
    ],
    providers: [FirebaseServiceService]
})
export class ProjectsListComponent implements OnInit {
    @ViewChild(ProjectModalComponent) projectModalComponent!: ProjectModalComponent;
    @Input() user: User | null = null;
    @Output() onSelectedProject: EventEmitter<Project> = new EventEmitter<Project>();
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

        if (this.projects.length > 0) {
            this.selectedProject = this.projects[0];
            this.onSelectedProject.emit(this.selectedProject);
        } else {
            this.selectedProject = new Project();
        }
        console.log('%cSelectedProject', 'color: #ff0000', this.selectedProject);

        this.navigationService.currentRefreshProjects.subscribe(boolean => {
            this.getProjects();
        });
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
    }

    async deleteProject(project: Project) {
        await this.firebaseService.deleteProject(project.id);
        await this.getProjects();
    }
}
