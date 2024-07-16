import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Project} from "../../interfaces/Kanban.interfaces";
import {KanbanService} from "../../../shared/services/kanban-service.service";

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
        private kanbanService: KanbanService,
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
        if (!this.project.id) {
            this.project.tasks = [];
            this.project.completed = false;
        }

        await this.kanbanService.addProject(this.project);
        this.onSave.emit();
        this.closeModal();
    }
}
