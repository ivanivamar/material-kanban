import {Component, EventEmitter, Output} from '@angular/core';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {Project} from '../../../modules/project';

@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.css'
})
export class CreateProjectModalComponent {
    showModal: boolean = false;
    project: Project = new Project();

    @Output() onSave: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private firebaseService: FirebaseServiceService
    ) {
    }

    save() {
        this.firebaseService.createProject(this.project).then(r => {
            this.close();
            this.onSave.emit();
        });
    }

    close() {
        this.showModal = false;
        this.project = new Project();
    }
}
