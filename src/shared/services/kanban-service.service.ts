import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import {Images, Project} from '../../app/interfaces/Kanban.interfaces';
import {
    Firestore,
    collectionData,
    collection,
    addDoc,
    deleteDoc,
    doc,
    DocumentData,
    updateDoc,
    getDoc, query, where,
} from '@angular/fire/firestore';
import {deleteObject, getDownloadURL, getMetadata, ref, Storage, uploadBytes} from '@angular/fire/storage';
import {DomSanitizer} from "@angular/platform-browser";
import { limit, orderBy, startAt } from 'firebase/firestore';

@Injectable({
    providedIn: 'root'
})
export class KanbanService {

    constructor(
        private firestore: Firestore,
        private storage: Storage,
        private sanitizer: DomSanitizer) { }

    //#region Getters
    getProjects(getData: any): Observable<Project[]> {
        const projectRef = query(collection(this.firestore, 'projects'),
            where('owner.uid', '==', getData.uid),
			orderBy('title'),
			startAt(getData.skipCount),
			limit(getData.maxResultsCount)
        );
		console.log(projectRef);
		console.log(getData);
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

    getUsers(): Observable<any[]> {
        const usersRef = collection(this.firestore, 'users');
        return collectionData(usersRef, { idField: 'id' }) as Observable<any[]>;
    }

    getUserById(userId: string): Observable<any> {
        const userRef = doc(this.firestore, 'users', userId);
        return new Observable<any>(observer => {
            getDoc(userRef).then(user => {
                observer.next(user.data());
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

    addUser(userId: string, user: any) {
        const userRef = collection(this.firestore, 'users');
        return addDoc(userRef, user);
    }

    updateProject(project: any) {
        const projectRef = collection(this.firestore, 'projects');
        return updateDoc(doc(projectRef, project.id), project);
    }

    updateUser(userId: string, user: any) {
        const userRef = collection(this.firestore, 'users');
        return updateDoc(doc(userRef, userId), user);
    }

    uploadImage(image: Images, file: File): Promise<any> {
        let folderName = '';
        switch (image.type) {
            case 'image':
                folderName = 'images/';
                break;
            case 'file':
                folderName = 'files/';
                break;
            default:
                folderName = 'others/';
        }

        const imageRef = ref(this.storage, folderName + image.name);
        return uploadBytes(imageRef, file)
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

    deleteUser(userId: string) {
        const userRef = collection(this.firestore, 'users');
        return deleteDoc(doc(userRef, userId));
    }

    deleteImage(image: any) {
        const imageRef = ref(this.storage, image.url);
        return deleteObject(imageRef);
    }
    //#endregion

    //#region Helpers
    downloadFile(file: Images) {
        const imageRef = ref(this.storage, file.url);
        return getDownloadURL(imageRef);
    }

    private idGenerator(): string {
        // letters + numbers
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let autoId = '';
        for (let i = 0; i < 5; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return autoId;
    }

    idNumbersGenerator(): number {
        // numbers
        const chars = '0123456789';
        let autoId = '';
        for (let i = 0; i < 5; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return Number(autoId);
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
