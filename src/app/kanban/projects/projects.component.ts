import {Component, ViewChild} from '@angular/core';
import {Project} from '../../../modules/project';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {CreateProjectModalComponent} from '../create-project-modal/create-project-modal.component';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [
        CreateProjectModalComponent
    ],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
    providers: [FirebaseServiceService]
})
export class ProjectsComponent {
    @ViewChild(CreateProjectModalComponent) createProjectModal!: CreateProjectModalComponent;

    projects: Project[] = [];
    selectedProject: Project = new Project();

    constructor(
        private firebaseService: FirebaseServiceService
    ) {
    }

    ngOnInit() {
        this.getProjects();
    }

    async getProjects() {
        this.projects = await this.firebaseService.getProjects();
        if (this.projects.length > 0) {
            this.selectedProject = this.projects[0];
        } else {
            this.createProjectModal.showModal = true;
        }
    }
}
