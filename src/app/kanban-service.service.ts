import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Project } from './interfaces/Kanban.interfaces';
import {
    Firestore,
    collectionData,
    collection,
    addDoc,
    deleteDoc,
    doc,
    DocumentData,
    updateDoc,
    getDoc,
} from '@angular/fire/firestore';
import { getDownloadURL, getMetadata, ref, Storage, uploadBytes } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class KanbanService {

    constructor(
        private firestore: Firestore,
        private storage: Storage) { }

    //#region Getters
    getProjects(): Observable<Project[]> {
        const projectRef = collection(this.firestore, 'projects');
        return collectionData(projectRef, { idField: 'id' }) as Observable<Project[]>;
    }

    getProjectById(projectId: string): Observable<Project> {
        const projectRef = doc(this.firestore, 'projects', projectId);
        return new Observable<Project>(observer => {
            getDoc(projectRef).then(project => {
                observer.next(project.data() as Project);
                observer.complete();
            }).catch(error => {
                observer.error(error);
            });
        });
    }
    //#endregion

    //#region Setters
    addProject(project: any) {
        const projectRef = collection(this.firestore, 'projects');
        return addDoc(projectRef, project);
    }

    updateProject(project: any) {
        const projectRef = collection(this.firestore, 'projects');
        return updateDoc(doc(projectRef, project.id), project);
    }

    uploadImage(image: any): Promise<any> {
        const imageRef = ref(this.storage, 'images/' + this.idGenerator());
        return uploadBytes(imageRef, image)
            .then(response => {
                // return the download url and the image name
                return combineLatest([
                    getDownloadURL(response.ref),
                    getMetadata(response.ref)
                ]).pipe(
                    map(([url, metadata]) => {
                        return {
                            url,
                            name: metadata.name
                        };
                    })
                ).toPromise();
            })
            .catch(error =>  console.log(error));
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
