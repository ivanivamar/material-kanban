import {Component, EventEmitter, inject, Output} from '@angular/core';
import {ModalBaseComponent} from '../ModalBaseComponent';
import {Project} from '../../../modules/project';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {RippleDirective} from '../ripple.directive';
import {FormsModule} from '@angular/forms';
import {Timestamp} from 'firebase/firestore';

@Component({
    selector: 'app-project-modal',
    imports: [
        RippleDirective,
        FormsModule
    ],
    templateUrl: './project-modal.component.html',
    styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent extends ModalBaseComponent {
    @Output() onSave: EventEmitter<void> = new EventEmitter();

    private firebaseService = inject(FirebaseServiceService);
    project: Project = new Project();

    public show(project?: Project) {
        if (project) {
            this.project = JSON.parse(JSON.stringify(project));
            this.edit = true;
        } else {
            this.project.createdAt = new Date().toString();
            this.project.updatedAt = new Date().toString();
            this.project.id = this.firebaseService.generateId();
        }
        this.showModal = true;
    }

    generateProjectCode() {
        this.project.code = this.project.name.toUpperCase().substring(0, 3);
    }

    save() {
        let input: Project = {
            id: this.project.id,
            code: this.project.name.toUpperCase().substring(0, 3),
            name: this.project.name,
            tasks: this.project.tasks,
            createdAt: this.project.createdAt,
            updatedAt: this.project.createdAt,
            userId: this.project.userId
        }
        if (this.edit) {
            input.updatedAt = new Date().toString();
        }

        this.firebaseService.saveProject(input).then(project => {
            this.onSave.emit(project);
            this.close();
        })
    }

    close(): void {
        this.showModal = false;
        this.project = new Project();
        this.edit = false;
    }
}
