import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Project} from "../../interfaces/elements";
import {UserLite} from "../../interfaces/Kanban.interfaces";

@Component({
    selector: 'app-task-filters',
    templateUrl: './task-filters.component.html',
    styleUrls: ['./task-filters.component.sass']
})
export class TaskFiltersComponent {
    @Input() members: UserLite[] = [];

    @Output() filters: EventEmitter<TaskFilter[]> = new EventEmitter<TaskFilter[]>();

    projectData = new Project();
    filtersData: TaskFilter[] = [];
    selectedFilter: TaskFilter | null = null;

    filtersList: TaskFilters[] = [
        {
            name: 'dueDate',
            label: 'Due Date',
            icon: 'schedule',
            values: null
        },
        {
            name: 'dateOrder',
            label: 'Date Order',
            icon: 'history',
            values: null
        },
        {
            name: 'assignedTo',
            label: 'Assigned To',
            icon: 'badge',
            values: this.members
        },
        {
            name: 'status',
            label: 'Status',
            icon: 'bookmark',
            values: this.projectData.statusList
        },
    ];

    constructor(private _eref: ElementRef) {}

    addFilter(event: Event, filter?: TaskFilter) {
        if (filter) {
            this.selectedFilter = filter;
        } else {
            this.selectedFilter = {
                name: '',
                values: []
            };
        }
    }

    updateFilter(variable: string, filterItem: TaskFilters) {
        if (this.selectedFilter) {
            switch (variable) {
                case 'name':
                    this.selectedFilter.name = filterItem.name;
                    console.log(this.selectedFilter);
                    break;
            }
        }
    }
}

interface TaskFilters {
    name: string;
    label: string;
    icon: string;
    values: any[] | any;
}

interface TaskFilter {
    name: string;
    values: any[] | any;
}
