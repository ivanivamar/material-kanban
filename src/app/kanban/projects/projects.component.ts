import {Component} from '@angular/core';
import {Project} from '../../../modules/project';
import {FirebaseServiceService} from '../../../services/firebase-service.service';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
    providers: [FirebaseServiceService]
})
export class ProjectsComponent {
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
    }
}
