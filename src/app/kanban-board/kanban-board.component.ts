import { Urgency } from './../interfaces/Kanban.interfaces';
import { ProjectWithId, Task } from '../interfaces/Kanban.interfaces';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  deleteDoc,
  doc,
  DocumentData,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.sass'],
  providers: []
})
export class KanbanBoardComponent implements OnInit {
  projects: any[] = [];
  project: ProjectWithId = {} as ProjectWithId;
  projectId: string = '';
  loading: boolean = false;

  showAddColumnModal: boolean = false;
  columnTitle: string = '';

  showEditColumnModal: boolean = false;
  columnEditId: string = '';
  columnEditTitle: string = '';

  showAddTaskModal: boolean = false;
  taskColumnId: string = '';
  taskId: string = '';
  taskTitle: string = '';
  taskDescription: string = '';
  taskUrgency: Urgency = {} as Urgency;
  taskLabels: string[] = [];
  taskCheckboxes: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params == null || params['projectId'] == null) {
        this.router.navigate(['/dashboard']);
      } else {
        this.loading = true;
        this.projectId = params['projectId'];
        this.getProjects().subscribe((projects: ProjectWithId[]) => {
          console.log(projects);
          this.projects = projects;
          this.project = this.projects.find((project: ProjectWithId) => project.id === this.projectId);
          console.log('%c Project: ', 'background: #222; color: #bada55', this.project);
          this.loading = false;
        });
      }
    });
  }

  editColumnSetup(columnId: string, columnTitle: string) {
    this.columnEditId = columnId;
    this.columnEditTitle = columnTitle;
    this.showEditColumnModal = true;
  }

  addTaskSetup(columnId: string) {
    this.taskColumnId = columnId;
    this.showAddTaskModal = true;
  }

  editTaskSetup(columnId: string, task: Task) {
    this.taskColumnId = columnId;
    this.taskId = task.id;
    this.taskTitle = task.title;
    this.taskDescription = task.description;
    this.taskUrgency = task.urgency;
    this.taskLabels = task.labels;
    this.taskCheckboxes = task.checkboxes;
    this.showAddTaskModal = true;
  }

  //#region Getters
  getProjects(): Observable<ProjectWithId[]> {
    const projectRef = collection(this.firestore, 'projects');
    return collectionData(projectRef, { idField: 'id' }) as Observable<
      ProjectWithId[]
    >;
  }
  //#endregion

  //#region Setters
  async addColumn() {
    this.loading = true;
    const projectRef = doc(this.firestore, 'projects', this.projectId);
    await updateDoc(projectRef, {
      columns: [
        ...this.project.columns,
        {
          id: this.idGenerator(),
          title: this.columnTitle,
          tasks: [],
        },
      ],
    });
    this.loading = false;
    this.showAddColumnModal = false;
  }

  async editColumn() {
    this.loading = true;
    const projectRef = doc(this.firestore, 'projects', this.projectId);
    await updateDoc(projectRef, {
      columns: this.project.columns.map((column: any) => {
        if (column.id === this.columnEditId) {
          column.title = this.columnEditTitle;
        }
        return column;
      }),
    });
    this.loading = false;
    this.showEditColumnModal = false;
  }

  async addTask() {
    this.loading = true;
    const projectRef = doc(this.firestore, 'projects', this.projectId);
    if (this.taskId === '') {
      await updateDoc(projectRef, {
        columns: this.project.columns.map((column: any) => {
          if (column.id === this.taskColumnId) {
            column.tasks = [
              ...column.tasks,
              {
                id: this.idGenerator(),
                title: this.taskTitle,
                description: this.taskDescription,
                urgency: this.taskUrgency,
                labels: this.taskLabels,
                checkboxes: this.taskCheckboxes,
                creationDate: new Date(),
              },
            ];
          }
          return column;
        }),
      });
    } else {
      await updateDoc(projectRef, {
        columns: this.project.columns.map((column: any) => {
          if (column.id === this.taskColumnId) {
            column.tasks = column.tasks.map((task: any) => {
              if (task.id === this.taskId) {
                task.title = this.taskTitle;
                task.description = this.taskDescription;
                task.urgency = this.taskUrgency;
                task.labels = this.taskLabels;
                task.checkboxes = this.taskCheckboxes;
              }
              return task;
            });
          }
          return column;
        }),
      });
    }
    this.loading = false;
    this.clearTask();
    this.showAddTaskModal = false;
  }

  //#endregion

  //#region Deleters
  async deleteColumn(projectId: string, columnId: string) {
    this.loading = true;
    const projectRef = doc(this.firestore, 'projects', projectId);
    await updateDoc(projectRef, {
      columns: this.project.columns.filter((column: any) => column.id !== columnId)
    });
    this.loading = false;
  }

  async deleteTask(projectId: string, columnId: string, taskId: string) {
    this.loading = true;
    const projectRef = doc(this.firestore, 'projects', projectId);
    await updateDoc(projectRef, {
      columns: this.project.columns.map((column: any) => {
        if (column.id === columnId) {
          column.tasks = column.tasks.filter((task: any) => task.id !== taskId);
        }
        return column;
      })
    });
    this.loading = false;
  }
  //#endregion


  //#region Helpers
  clearTask() {
    this.taskColumnId = '';
    this.taskId = '';
    this.taskTitle = '';
    this.taskDescription = '';
    this.taskUrgency = {} as Urgency;
    this.taskLabels = [];
    this.taskCheckboxes = [];
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
}
