import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {FirebaseServiceService} from '../../../../services/firebase-service.service';
import {Project} from '../../../../modules/project';
import {RippleDirective} from '../../ripple.directive';

@Component({
    selector: 'app-projects-list',
    standalone: true,
    imports: [
        RippleDirective
    ],
    templateUrl: './projects-list.component.html',
    styleUrl: './projects-list.component.sass',
    providers: [FirebaseServiceService]
})
export class ProjectsListComponent implements OnInit {
    @Output() onSelectedProject: EventEmitter<Project> = new EventEmitter<Project>();
    private firebaseService = inject(FirebaseServiceService);

    projects: Project[] = [];
    selectedProject: Project = new Project();

    async ngOnInit() {
        this.projects = await this.firebaseService.getProjects();

        if (this.projects.length > 0) {
            this.selectedProject = this.projects[0];
            this.onSelectedProject.emit(this.selectedProject);
        }
    }
}
