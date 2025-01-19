import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {FirebaseServiceService} from '../../../../services/firebase-service.service';
import {Project, Status, Task} from '../../../../modules/project';
import {User} from 'firebase/auth';
import {RippleDirective} from '../../ripple.directive';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {Editor} from 'primeng/editor';
import {Calendar} from 'primeng/calendar';
import {Drawer} from 'primeng/drawer';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-navbar-task-modal',
    imports: [
        Dialog,
        RippleDirective,
        InputText,
        Select,
        FormsModule,
        Editor,
        Calendar,
        Drawer,
        DatePicker
    ],
  templateUrl: './navbar-task-modal.component.html',
  styleUrl: './navbar-task-modal.component.css'
})
export class NavbarTaskModalComponent implements OnInit {
    private firebaseService = inject(FirebaseServiceService);

    @Output() onTaskCreated = new EventEmitter<void>();

    showModal: boolean = false;
    projects: Project[] = [];
    selectedProject: Project = new Project();
    task: Task = new Task();
    statusArray = [
        {
            label: 'Not Started',
            value: Status.NOT_STARTED
        },
        {
            label: 'In Progress',
            value: Status.IN_PROGRESS
        },
        {
            label: 'Completed',
            value: Status.COMPLETED
        }
    ];

    async ngOnInit() {
        const user: User = JSON.parse(localStorage.getItem('user') || '{}');
        this.projects = await this.firebaseService.getProjects(user.uid);
    }

    public show(project: Project, task?: Task) {
        this.selectedProject = project;
        this.showModal = true;
        if (task) {
            console.log(task);
            this.task = task;
            this.task.dueDate = '';
        }
    }

    save() {
        const taskInput: Task = {
            id: this.firebaseService.generateId(),
            projectId: this.selectedProject?.id || '',
            name: this.task.name,
            description: this.task.description,
            dueDate: this.task.dueDate.toString(),
            status: this.task.status,
            subtasks: this.task.subtasks,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString()
        };

        // check if the project has this task
        if (this.selectedProject.tasks.find(task => task.id === taskInput.id)) {
            this.selectedProject.tasks = this.selectedProject.tasks.map(task => {
                if (task.id === taskInput.id) {
                    return taskInput;
                } else {
                    return task;
                }
            });
        } else {
            this.selectedProject.tasks.push(taskInput);
        }

        this.firebaseService.saveProject(this.selectedProject).then(() => {
            this.onTaskCreated.emit();
            this.showModal = false;
        });
    }
}
