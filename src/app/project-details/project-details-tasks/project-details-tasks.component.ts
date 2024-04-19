import {Component, ElementRef, EventEmitter, Input, LOCALE_ID, OnInit, Output, ViewChild} from '@angular/core';
import {ProjectDetails, StatusList, UrgencyList} from "../../../shared/helpers/projectClasses";
import {KanbanService} from "../../../shared/services/kanban-service.service";
import {ConfirmationService} from "primeng/api";
import {Subtasks, Status, Task, TaskDto, Urgency, UserLite} from 'src/app/interfaces/Kanban.interfaces';
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
    selector: 'app-project-details-tasks',
    templateUrl: './project-details-tasks.component.html',
    styleUrls: ['./project-details-tasks.component.sass'],
    providers: [KanbanService, ConfirmationService]
})
export class ProjectDetailsTasksComponent implements OnInit {
    @Input() project: ProjectDetails = new ProjectDetails();
    @Input() users: any[] = [];
    @Output() onChanges = new EventEmitter();

    viewType = 'grid';
    currentPageTasks: Task[] = [];
    loading = false;
    selectedTask: TaskDto | null = null;
    isManagingTask = false;

    statusList = StatusList;
    urgencyList: Urgency[] = UrgencyList;

    constructor(
        private kanbanService: KanbanService,
        private confirmService: ConfirmationService,
        private router: Router,
        private route: ActivatedRoute,
        private _location: Location,
    ) {
    }

    ngOnInit() {
        // Set the current page tasks to the project tasks max 10
        this.getCurrentPageTasks(1);
        // set task from url
        this.route.url.subscribe(async (url: any) => {
            if (url.length === 0) {
                this.router.navigate(['']);
            } else if (url.length === 4 && url[2].path === 'tasks') {
                const taskId = url[3].path;
                if (taskId != 'new') {
                    this.selectedTask = this.project.tasks.find(task => task.id === taskId) as TaskDto;
                    this.isManagingTask = true;
                } else {
                    this.selectedTask = new TaskDto();
                    this.selectedTask.owner = this.project.owner;
                    this.isManagingTask = true;
                }
            }
        });
    }

    getCurrentPageTasks(pageNumber: number) {
        this.loading = true;
        this.currentPageTasks = [];
        const offset = (pageNumber - 1) * 8;
        const endIndex = Math.min(offset + 8, this.project.tasks.length);

        for (let i = offset; i < endIndex; i++) {
            this.currentPageTasks.push(this.project.tasks[i]);
        }
        this.loading = false;
    }

    manageTask(task?: Task) {
        this.selectedTask = task ? task : new TaskDto();
        this.selectedTask.owner = this.project.owner;
        this.isManagingTask = true;
        // add task to url
        this._location.go('/projects/' + this.project.id + '/tasks/' + (task ? task.id : 'new'));
    }

    completedSubtasks(subtasks: Subtasks[]) {
        return subtasks.filter(subtask => subtask.checked).length;
    }

    saveTaskChanges(task: TaskDto) {
        let managedTask = JSON.parse(JSON.stringify(task)) as Task;
        if (managedTask.id) {
            // update the task
            this.project.tasks = this.project.tasks.map(task => task.id === managedTask.id ? managedTask : task);
        } else {
            // add the task
            managedTask.id = this.idGenerator();
            this.project.tasks.push(managedTask);
        }
        // update the project
        this.kanbanService.updateProject(this.project);
        /*Swal.fire({
            icon: 'success',
            title: 'Task saved successfully',
            confirmButtonText: 'Ok, got it!'
        });*/

        // update the current page tasks
        this.getCurrentPageTasks(1);
        this.isManagingTask = false;
        this.onChanges.emit();
    }

    confirmDeleteTask(task: Task, event: any) {
        this.confirmService.confirm({
            target: event.target,
            message: 'Are you sure you want to delete this task?',
            icon: 'fa-duotone fa-triangle-exclamation',
            accept: () => {
                this.onTaskDelete({task});
            }
        });

    }

    onTaskDelete(task: any) {
        this.loading = true;
        // filter out the task
        this.project.tasks = this.project.tasks.filter(t => t.id !== task.id);
        // update the project
        this.kanbanService.updateProject(this.project);
        // update the current page tasks
        this.getCurrentPageTasks(1);
        this.isManagingTask = false;
        this.selectedTask = null;
        this.onChanges.emit();
    }

    cancel() {
        this.isManagingTask = false;
        this.selectedTask = null;
        // remove task from url
        this._location.go('/projects/' + this.project.id + '/tasks');
    }

    idGenerator(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let autoId = '';
        for (let i = 0; i < 10; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return autoId;
    }
}
