import {Component, ElementRef, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {globalUser} from '../../../constants/enviroment';
import {Project} from '../../../modules/project';

@Component({
    host: {
        '(document:click)': 'checkClickOutside($event)',
    },
    selector: 'app-create-project',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './create-project.component.html',
    styleUrl: './create-project.component.css',
    providers: [FirebaseServiceService]
})
export class CreateProjectComponent {
    @Output() onCreate = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    projectName = '';

    constructor(
        private firebaseService: FirebaseServiceService,
        private _eref: ElementRef
    ) {
    }

    createProject() {
        let project = {
            id: this.firebaseService.generateId(),
            name: this.projectName,
            userId: globalUser.userId,
            columns: [],
            createdAt: new Date(),
            updatedAt: new Date()
        } as Project;

        this.firebaseService.createProject(project).then(r => {
            this.onCreate.emit();
            this.projectName = '';
        });
    }

    // detect Enter key press
    onKeyPress(event: KeyboardEvent) {
        if (this.firebaseService.isNullOrEmpty(this.projectName)) {
            return;
        }

        if (event.key === 'Enter') {
            this.createProject();
        }
    }

    checkClickOutside(event: Event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.projectName = '';
            this.onClose.emit();
        }
    }
}
