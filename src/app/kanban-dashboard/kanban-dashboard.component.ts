import { KanbanBoardComponent } from '../kanban-board/kanban-board.component';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  deleteDoc,
  doc,
  DocumentData,
} from '@angular/fire/firestore';
import { Project, Column, Task, ProjectWithId } from '../interfaces/Kanban.interfaces';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kanban-dashboard',
  templateUrl: './kanban-dashboard.component.html',
  styleUrls: ['./kanban-dashboard.component.sass'],
})
export class KanbanDashboardComponent implements OnInit {
  projects: any[] = [];
  showAddProjectModal: boolean = false;

  darkColorArray = [
    '#FFE8BC',
    '#E5C7F5',
    '#F8D4C7',
  ];
  lightColorArray = [
    '#FFF9EB',
    '#F7F0FB',
    '#FFF2EE',
  ];
  loading: boolean = false;
  project = null;

  projectTitle: string = '';

  constructor(private firestore: Firestore, private router: Router) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.getProjects().subscribe((projects: ProjectWithId[]) => {
      console.log(projects);
      this.projects = projects;
      this.loading = false;
    });
  }

  navigateToProject(project: ProjectWithId) {
    this.router.navigate(['/dashboard/kanban'], { queryParams: { project: JSON.stringify(project) } });
  }

  //#region Getters
  getProjects(): Observable<ProjectWithId[]> {
    const projectRef = collection(this.firestore, 'projects');
    return collectionData(projectRef, { idField: 'id' }) as Observable<
      ProjectWithId[]>;
  }

  getProjectById(projectId: string) {
    const projectRef = collection(this.firestore, 'projects');
    return doc(projectRef, projectId);
  }
  //#endregion

  //#region Setters
  async addProject() {
    const response = await this.sendAddProject(this.projectTitle);
    console.log(response);

    this.showAddProjectModal = false;
    this.projectTitle = '';
  }
  sendAddProject(project: any) {
    const projectRef = collection(this.firestore, 'projects');
    return addDoc(projectRef, project);
  }
  //#endregion

  //#region Deleters
  async deleteProject(projectId: string) {
    const response = await this.sendDeleteProject(projectId);
    console.log(response);
  }
  sendDeleteProject(projectId: string) {
    const projectRef = collection(this.firestore, 'projects');
    return deleteDoc(doc(projectRef, projectId));
  }
  //#endregion

  //#region Helpers
  getTasksCount(project: Project): number {
    let count = 0;
    project.columns.forEach((column: Column) => {
      count += column.tasks.length;
    });
    return count;
  }

  private idGenerator(): string {
    // letters + numbers
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
        if (input.length === 0 || input === '' || input === null || input === undefined) {
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
