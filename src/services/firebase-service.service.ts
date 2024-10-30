import {Injectable} from '@angular/core';
import {collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import {db, globalUser} from '../constants/enviroment';
import {Project} from '../modules/project';

@Injectable({
    providedIn: 'root'
})
export class FirebaseServiceService {
    async getProjects(): Promise<any> {
        const getProjectsByUserId = query(collection(db, 'projects'),
            where('userId', '==', globalUser.userId));

        const querySnapshot = await getDocs(getProjectsByUserId);
        const projects = querySnapshot.docs.map(doc => doc.data());
        console.log("%cProjects", "color: green; font-size: 16px;", projects);
        return projects;
    }

    async createProject(project: Project) {
        await setDoc(doc(db, 'projects', project.id), project);
    }

    async deleteProject(projectId: string) {
        await deleteDoc(doc(db, 'projects', projectId));
    }
}
