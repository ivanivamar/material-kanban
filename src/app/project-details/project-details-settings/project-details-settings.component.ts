import {Component, Input} from '@angular/core';
import {ProjectDetails} from "../../../shared/helpers/projectClasses";
import {ConfirmationService, MessageService} from "primeng/api";
import {KanbanService} from "../../../shared/services/kanban-service.service";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-project-details-settings',
    templateUrl: './project-details-settings.component.html',
    styleUrls: ['./project-details-settings.component.sass'],
    providers: [ConfirmationService, MessageService, KanbanService]
})
export class ProjectDetailsSettingsComponent {
    @Input() project: ProjectDetails = new ProjectDetails();

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
        Swal.fire({
            text: 'Thank you! You\'ve updated your project settings',
            icon: 'success',
            confirmButtonText: 'Ok, got it!'
        });
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
            Swal.fire({
                text: 'Thank you! You\'ve deleted your project',
                icon: 'success',
                confirmButtonText: 'Ok, got it!'
            }).then((result: any) => {
                if (result.isConfirmed) {
                    window.location.href = '/projects';
                }
            });
        }
    }
}
