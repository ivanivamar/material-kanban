import {FormsModule} from '@angular/forms';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PaginatedResult, ProjectsComponent} from './projects.component';
import {KanbanService} from "../../shared/services/kanban-service.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Observable} from "rxjs";
import {Project} from "../interfaces/Kanban.interfaces";

describe('KanbanDashboardComponent', () => {
    let fixture: ComponentFixture<ProjectsComponent>;

    let projectsResponse: PaginatedResult<Project> = {
        records: [
            {
                id: '1',
                title: 'Project 1',
                description: 'Project 1 Description',
                image: '',
                tasks: [],
                completed: false,
                ownerId: '1',
                created: new Date().toString(),
                updated: new Date().toString()
            },
            {
                id: '2',
                title: 'Project 2',
                description: 'Project 2 Description',
                image: '',
                tasks: [],
                completed: false,
                ownerId: '1',
                created: new Date().toString(),
                updated: new Date().toString()
            }
        ],
        totalRecordCount: 2
    };

    /*beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [ProjectsComponent],
            schemas: [NO_ERRORS_SCHEMA],
        });

        await TestBed.compileComponents();

        fixture = TestBed.createComponent(ProjectsComponent);

        let _kanbanService = fixture.debugElement.injector.get(KanbanService);

        spyOn(_kanbanService, 'getProjects').and.returnValue(
            new Promise<PaginatedResult<Project>>(resolve => {
                resolve(projectsResponse);
            })
        );
    });

    it('should projectsResponse have 2 records', () => {
        let component = fixture.debugElement.componentInstance as ProjectsComponent;
        component.getProjects();

        expect(component.projects.items.length).toBe(2);
    });*/
});
