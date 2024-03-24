import {Project, Task, UserLite} from "../../app/interfaces/Kanban.interfaces";

export class ProjectDetails implements Project {
    id?: string;
    title: string = '';
    description: string = '';
    image: string = '';
    tasks: Task[] = [];
    completed: boolean = false;
    owner: UserLite = {
        username: '',
        email: '',
        photoURL: '',
        uid: '',
        sharedProjectsIds: []
    };
    ownerId: string = '';
    members: UserLite[] = [];
    membersIds: string[] = [];
}
