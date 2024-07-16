import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Project} from "../../interfaces/Kanban.interfaces";
import {KanbanService} from "../../../shared/services/kanban-service.service";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
    selector: 'app-project-modal',
    standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        NgIf
    ],
    templateUrl: './project-modal.component.html',
    styleUrl: './project-modal.component.sass',
    providers: [KanbanService]
})
export class ProjectModalComponent {
    @Output() onSave = new EventEmitter<void>();

    showModal = false;
    project: Project = new Project();

    constructor(
        private kanbanService: KanbanService
    ) {
    }

    openModal() {
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.project = new Project();
    }

    async save() {
        await this.kanbanService.addProject({
            title: this.project.title,
            description: this.project.description,
            image: this.project.image,
            tasks: this.project.tasks,
            completed: this.project.completed,
            ownerId: localStorage.getItem('uid'),
            created: new Date().toString(),
            updated: new Date().toString()
        });
        this.onSave.emit();
        this.closeModal();
    }
}
