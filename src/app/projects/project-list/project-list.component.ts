import {Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import {Project, Task} from '../../../modules/project';
import {Table, TableModule} from 'primeng/table';
import {SortEvent} from 'primeng/api';
import {Tag} from 'primeng/tag';
import {DatePipe} from '@angular/common';
import {NavigationService} from '../../../services/navigation.service';
import {NavbarTaskModalComponent} from '../../shared/navbar/navbar-task-modal/navbar-task-modal.component';

@Component({
    selector: 'app-project-list',
    imports: [
        TableModule,
        Tag,
        DatePipe,
        NavbarTaskModalComponent
    ],
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
    @ViewChild('table') table!: Table;
    private navigationService = inject(NavigationService);

    project: Project = new Project();

    isSorted: boolean | null = null;
    initialValue: Task[] = [];
    selectedTask: Task | null = null;

    ngOnInit() {
        this.navigationService.currentSelectedProject.subscribe(project => {
            this.project = project;
            this.initialValue = [...this.project.tasks];
            console.log(this.initialValue);
        });
    }

    refreshProjects() {
        this.navigationService.refreshProjects(true);
    }

    customSort(event: SortEvent) {
        if (this.isSorted == null) {
            this.isSorted = true;
            this.sortTableData(event);
        } else if (this.isSorted) {
            this.isSorted = false;
            this.sortTableData(event);
        } else if (!this.isSorted) {
            this.isSorted = null;
            this.project.tasks = [...this.initialValue];
            this.table.reset();
        }
    }

    sortTableData(event: any) {
        event.data.sort((data1: { [x: string]: any; }, data2: { [x: string]: any; }) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;
            if (value1 == null && value2 != null) result = -1;
            else if (value1 != null && value2 == null) result = 1;
            else if (value1 == null && value2 == null) result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
            else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

            return event.order * result;
        });
    }

    getSeverity(status: string): any {
        switch (status) {
            case 'Not Started':
                return 'secondary';
            case 'In Progress':
                return 'primary';
            case 'Completed':
                return 'success';
        }

        return 'secondary';
    }

    onRowSelect(event: any) {
        this.selectedTask = event.data;
    }
}
