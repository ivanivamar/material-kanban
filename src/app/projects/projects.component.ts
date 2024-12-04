import {Component, inject, OnInit} from '@angular/core';
import {FirebaseServiceService} from '../../services/firebase-service.service';
import {NavigationService} from '../../services/navigation.service';
import {Project} from '../../modules/project';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
    providers: [FirebaseServiceService]
})
export class ProjectsComponent implements OnInit {
    private firebaseService = inject(FirebaseServiceService);
    private navigationService = inject(NavigationService);
    selectedProject: Project = new Project();

    ngOnInit() {
        this.navigationService.updateOrigin('projects');

        this.navigationService.currentSelectedProject.subscribe(project => {
            this.selectedProject = project;
        });
    }
}
