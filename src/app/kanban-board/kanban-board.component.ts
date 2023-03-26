import { ProjectWithId } from '../interfaces/Kanban.interfaces';
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
  //#endregion


  //#region Helpers
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
