import {Injectable} from '@angular/core';
import {collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore';
import {db, globalUser} from '../constants/enviroment';
import {Project} from '../modules/project';

@Injectable({
    providedIn: 'root'
})
export class FirebaseServiceService {
    async getProjects(uid: string): Promise<any> {
        const getProjectsByUserId = query(collection(db, 'projects'),
            where('userId', '==', uid),
            orderBy('updatedAt', 'desc'));

        const querySnapshot = await getDocs(getProjectsByUserId);
        const projects = querySnapshot.docs.map(doc => doc.data());
        return projects;
    }

    async saveProject(project: Project) {
        await setDoc(doc(db, 'projects', project.id), project);
    }

    async deleteProject(projectId: string) {
        await deleteDoc(doc(db, 'projects', projectId));
    }

    generateId() {
        // generate a random guid
        let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return id;
    }

    isNullOrEmpty(string: string) {
        return string === null || string === undefined || string.trim() === '';
    }
}
