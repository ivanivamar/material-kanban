import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Project} from "../../interfaces/elements";
import {IDropdownOption, UserLite} from "../../interfaces/Kanban.interfaces";

// @ts-ignore
@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'app-task-filters',
    templateUrl: './task-filters.component.html',
    styleUrls: ['./task-filters.component.sass']
})
export class TaskFiltersComponent {
    @Input() members: UserLite[] = [];

    @Output() filters: EventEmitter<TaskFilters[]> = new EventEmitter<TaskFilters[]>();

    projectData = new Project();
    filtersData: TaskFilters[] = [];
    // @ts-ignore
    selectedFilter: TaskFilters | null = null;
    selectedFilterIndex: number = -1;
    usedFilterNames: string[] = [];

    filtersList: TaskFilters[] = [
        {
            name: 'dueDate',
            label: 'Due Date',
            icon: 'schedule',
            order: '',
            values: [],
            value: null
        },
        {
            name: 'dateRange',
            label: 'Date Range',
            icon: 'history',
            order: '',
            values: [],
            value: null
        },
        {
            name: 'assignedTo',
            label: 'Assigned To',
            icon: 'badge',
            order: '',
            values: this.members,
            value: null
        },
        {
            name: 'status',
            label: 'Status',
            icon: 'bookmark',
            order: '',
            values: this.projectData.statusList,
            value: null
        },
    ];

    constructor(private _eref: ElementRef) {}

    onClick(event: Event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            // @ts-ignore
            this.selectedFilter = null;
        }
    }

    addFilter(event: Event, filter?: TaskFilters) {
        if (filter) {
            this.selectedFilter = filter;
            this.selectedFilterIndex = this.filtersData.findIndex((item: any) => item.name === filter.name);
        } else {
            this.selectedFilter = {
                name: '',
                label: '',
                icon: '',
                order: '',
                values: [],
                value: null
            };
            this.filtersData.push(this.selectedFilter);
            this.selectedFilterIndex = this.filtersData.length - 1;
        }
    }

    removeFilter(filter: TaskFilters) {
        const filterIndex = this.filtersData.findIndex((item: any) => item.name === filter.name);
        this.usedFilterNames.splice(filterIndex, 1);
        this.filtersData.splice(filterIndex, 1);
        if (filterIndex === this.selectedFilterIndex) {
            // @ts-ignore
            this.selectedFilter = null;
            this.selectedFilterIndex = -1;
        }

        this.filters.emit(this.filtersData);
    }

    updateOrder(order: string) {
        if (this.selectedFilter) {
            if (this.selectedFilter.order === order) {
                this.selectedFilter.order = '';
            } else {
                this.selectedFilter.order = order;
            }
        }
    }

    updateFilter(variable: string, filterItem: TaskFilters) {
        if (this.selectedFilter) {
            this.selectedFilter.values = [];
            this.selectedFilter.value = null;
            this.usedFilterNames.splice(this.selectedFilterIndex, 1)
            this.usedFilterNames.push(filterItem.name);
            switch (variable) {
                case 'name':
                    this.selectedFilter.name = filterItem.name;
                    this.selectedFilter.label = filterItem.label;
                    break;
            }
        }
    }

    updateStatusFilter(status: TaskFilters) {
        // check if status is already in the list
        const statusIndex = this.selectedFilter?.values.findIndex((item: any) => item === status.name);
        if (statusIndex === -1) {
            this.selectedFilter?.values.push(status.name);
        } else {
            // @ts-ignore
            this.selectedFilter?.values.splice(statusIndex, 1);
        }

        this.updateFilters();
    }

    updateFilters() {
        if (this.filtersData.length === 0) {
            if (this.selectedFilter) {
                this.filtersData.push(this.selectedFilter);
            }
        } else {
            if (this.selectedFilterIndex === -1) {
                this.filtersData.push(this.selectedFilter as TaskFilters);
            } else {
                this.filtersData[this.selectedFilterIndex] = this.selectedFilter as TaskFilters;
            }
        }

        this.filters.emit(this.filtersData);
    }
}

export interface TaskFilters {
    name: string;
    label: string;
    icon: string;
    order: string;
    values: any[];
    value: any;
}
