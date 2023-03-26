import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, DocumentData, Firestore } from 'firebase/firestore';
import { Project } from './interfaces/Kanban.interfaces';
import { collectionData, collectionSnapshots } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class KanbanService {

    constructor(private firestore: Firestore) { }

    //#region Getters
    getProjects(): Observable<Project[]> {
        const projectRef = collection(this.firestore, 'projects');
        return collectionData(projectRef, { idField: 'id' }) as Observable<Project[]>;
    }

    getProjectById(projectId: string) {
        const projectRef = collection(this.firestore, 'projects');
        return doc(projectRef, projectId);
    }
    //#endregion

    //#region Setters
    sendAddProject(project: any) {
        const projectRef = collection(this.firestore, 'projects');
        return addDoc(projectRef, project);
    }
    //#endregion

    //#region Deleters
    deleteProject(projectId: string) {
        const projectRef = collection(this.firestore, 'projects');
        return deleteDoc(doc(projectRef, projectId));
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
}
