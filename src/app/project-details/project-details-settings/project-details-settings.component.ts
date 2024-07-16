import {Component, Input} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {KanbanService} from "../../../shared/services/kanban-service.service";
import {Project} from "../../interfaces/Kanban.interfaces";

@Component({
    selector: 'app-project-details-settings',
    templateUrl: './project-details-settings.component.html',
    styleUrls: ['./project-details-settings.component.sass'],
    providers: [KanbanService]
})
export class ProjectDetailsSettingsComponent {
    @Input() project: Project = new Project();

    constructor(
        private confirmService: ConfirmationService,
        private kanbanService: KanbanService,
        private messageService: MessageService
    ) {
    }

    uploadImage(event: any) {
        // convert the image to base64
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
            this.project.image = reader.result as string;
        };
    }
    deleteImage(event: any) {
        this.confirmService.confirm({
            target: event.target,
            icon: 'fa-duotone fa-triangle-exclamation',
            message: 'Are you sure that you want to delete this image?',
            accept: () => {
                this.project.image = '';
            }
        });
    }

    saveProject() {
        this.kanbanService.updateProject(this.project);
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Project updated successfully'});
    }

    deleteProjectConfirm($event: any) {
        this.confirmService.confirm({
            target: $event.target,
            icon: 'fa-duotone fa-triangle-exclamation',
            message: 'Are you sure that you want to delete this project?',
            accept: () => {
                this.deleteProject();
            }
        });
    }

    async deleteProject() {
        if (this.project.id) {
            await this.kanbanService.deleteProject(this.project.id);
            window.location.href = '/projects';
        }
    }
}
