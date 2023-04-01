import { KanbanService } from 'src/app/kanban-service.service';
import { Component, OnInit } from '@angular/core';
import { from, Observable, } from 'rxjs';
import {
    Project,
    Column,
    Task,
    Urgency,
    Checkboxes,
} from '../interfaces/Kanban.interfaces';
import { Router } from '@angular/router';

@Component({
    selector: 'app-kanban-dashboard',
    templateUrl: './kanban-dashboard.component.html',
    styleUrls: ['./kanban-dashboard.component.sass'],
})
export class KanbanDashboardComponent implements OnInit {
    projects: any[] = [];
    showAddProjectModal: boolean = false;

    darkColorArray = ['#FFE8BC', '#E5C7F5', '#F8D4C7'];
    lightColorArray = ['#FFF9EB', '#F7F0FB', '#FFF2EE'];
    loading: boolean = false;
    project = null;

    projectTitle: string = '';

    data: any;
    options: any;

    currentWeekTasks: any[] = [];

    projectId: string = '';
    columnId: string = '';

    showTasksFromProject: string = '';

    constructor(private kanbanService: KanbanService, private router: Router) { }

    async ngOnInit(): Promise<void> {
        this.loading = true;

        from(this.kanbanService.getProjects()).subscribe((projects: any[]) => {
            this.projects = projects;
            this.loading = false;
            this.getCurrentWeekTasks();
            this.makeWeekTasksChart(this.projects);
        });
    }

    getCurrentWeekTasks() {
        this.currentWeekTasks = [];
        let tasksArray: any[] = [];
        this.projects.forEach((project: Project) => {
            project.columns.forEach((column: Column) => {
                column.tasks.forEach((task: Task) => {
                    let taskDate = new Date(task.creationDate);

                    let today = new Date();
                    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

                    if ((taskDate >= firstDayOfWeek && taskDate <= lastDayOfWeek) && !task.completed) {
                        tasksArray.push(
                            {
                                projectId: project.id,
                                columnId: column.id,
                                task: task
                            }
                        );
                    }
                });
            });
            let sendData = {
                project: project.title,
                tasks: tasksArray
            }
            this.currentWeekTasks.push(sendData);
            tasksArray = [];
        });

        // set showTasksFromProject to first project
        this.showTasksFromProject = this.currentWeekTasks[0].project;
    }

    makeWeekTasksChart(projects: Project[]) {
        let weekTasks = [0, 0, 0, 0, 0];
        let lastWeekTasks = [0, 0, 0, 0, 0];

        projects.forEach((project: Project) => {
            project.columns.forEach((column: Column) => {
                column.tasks.forEach((task: Task) => {
                    let taskDate = new Date(task.creationDate);

                    let taskDay = taskDate.getDay();
                    weekTasks[taskDay - 1]++;

                    let lastWeekDate = new Date(new Date().toUTCString());
                    if (taskDate > lastWeekDate) {
                        lastWeekTasks[taskDay - 1]++;
                    }
                });
            });
        });

        // remove 0 values from arrays
        weekTasks = weekTasks.filter((value) => value != 0);
        lastWeekTasks = lastWeekTasks.filter((value) => value != 0);

        this.data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [
                {
                    label: 'Current Week',
                    data: weekTasks,
                    borderColor: '#1A73E8',
                    fill: false,
                    tension: 0.4,
                },
                {
                    label: 'Previous Week',
                    data: lastWeekTasks,
                    borderColor: '#E8F0FE',
                    fill: false,
                    tension: 0.4,
                },
            ],
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 1,
            scales: {
                y: {
                    beginAtZero: true,
                    precision: 0
                },
            },
            scale: {
                ticks: {
                    precision: 0
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        };
    }

    navigateToProject(project: Project) {
        this.router.navigate(['/dashboard/kanban'], {
            queryParams: { projectId: project.id },
        });
    }

    //#region Setters
    async addProject() {
        let project: Project = {
            title: this.projectTitle,
            columns: []
        };

        this.kanbanService.addProject(project);

        this.showAddProjectModal = false;
        this.projectTitle = '';
    }
    //#endregion

    //#region Deleters
    async deleteProject(projectId: string, event: any) {
        event.stopPropagation();
        this.kanbanService.deleteProject(projectId);
    }
    //#endregion

    //#region Helpers
    getTotalCompletedTasks(task: Task) {
        return task.checkboxes.filter(t => t.checked).length;
    }

    getTasksCount(project: Project): number {
        let count = 0;
        project.columns.forEach((column: Column) => {
            count += column.tasks.length;
        });
        return count;
    }

    toDateTime(secs: any) {
        var t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(secs);
        return t;
    }

    private idGenerator(): string {
        // letters + numbers
        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let autoId = '';
        for (let i = 0; i < 20; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return autoId;
    }

    private isEmpty(obj: any) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    }

    private isInvalidInput(input: any): boolean {
        // check for string
        switch (typeof input) {
            case 'string':
                if (
                    input.length === 0 ||
                    input === '' ||
                    input === null ||
                    input === undefined
                ) {
                    return true;
                }
                break;
            case 'number':
                if (isNaN(input) || input === null || input === undefined) {
                    return true;
                }
                break;
            case 'boolean':
                if (input === null) {
                    return true;
                }
                break;
            case 'undefined':
                return true;
            case 'object':
                if (this.isEmpty(input)) {
                    return true;
                }
                break;
            default:
                return true;
        }
        return false;
    }
    //#endregion

    /* drop(event: CdkDragDrop<Task[]>, project: Project, column: Column) {
            moveItemInArray(column.tasks, event.previousIndex, event.currentIndex);
            //this.editColumn(project, column);
        } */
}
