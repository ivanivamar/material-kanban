import {combineLatest, map, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Images, Project} from '../../app/interfaces/Kanban.interfaces';
import {addDoc, collection,
    deleteDoc, doc, getCountFromServer, getDoc, getDocs, getFirestore, limit, orderBy, query, startAt,
    updateDoc, where} from 'firebase/firestore';
import {deleteObject, getDownloadURL, getMetadata, getStorage, ref, uploadBytes} from 'firebase/storage';
import {PaginatedResult} from "../../app/projects/projects.component";
import {initializeApp} from "firebase/app";
import {Router} from "@angular/router";
@Injectable({
    providedIn: 'root'
})
export class KanbanService {
    firebaseConfig = {
        projectId: 'materialkanban',
        appId: '1:465319731998:web:d609103c2889d47ab21f0f',
        databaseURL: 'https://materialkanban-default-rtdb.europe-west1.firebasedatabase.app',
        storageBucket: 'materialkanban.appspot.com',
        locationId: 'europe-west',
        apiKey: 'AIzaSyDbMsn2lDp8IQvtoEoTIGVlUyGKwhfsCvI',
        authDomain: 'materialkanban.firebaseapp.com',
        messagingSenderId: '465319731998',
        measurementId: 'G-LHTKBGT4VW',
    };
    app = initializeApp(this.firebaseConfig);
    firestore = getFirestore(this.app);
    storage = getStorage(this.app);

    constructor(
        private router: Router
    ) {
    }

    //#region Getters
    async getProjects(uid: string): Promise<PaginatedResult<Project>> {
        let projectRef = query(collection(this.firestore, 'projects'),
            where('ownerId', '==', localStorage.getItem('uid')),
            orderBy('updated', 'desc'),
        );
        const projects = await getDocs(projectRef).then(querySnapshot => {
            return querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                } as Project;
            });
        });
        return {
            records: projects,
            totalRecordCount: projects.length
        };
    }

    async getProjectById(projectId: string): Promise<any> {
        try {
            const projectRef = doc(this.firestore, 'projects', projectId);
            const docSnap = await getDoc(projectRef);
            return docSnap.data() as Project;
        } catch (error) {
            console.log(error);
        }
    }

    getUsers(): Observable<any[]> {
        const usersRef = collection(this.firestore, 'users');
        return new Observable<any[]>(observer => {
            getDocs(usersRef).then(users => {
                observer.next(users.docs.map(user => user.data()));
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
        project.updated = new Date().toString();
        const projectRef = collection(this.firestore, 'projects');
        return updateDoc(doc(projectRef, project.id), project);
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
                );
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

    public idGenerator(): string {
        // letters + numbers
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let autoId = '';
        for (let i = 0; i < 5; i++) {
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
}
