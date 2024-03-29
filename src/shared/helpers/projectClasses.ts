import {Project, Status, Task, Urgency, UserLite} from "../../app/interfaces/Kanban.interfaces";

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

export let StatusList: Status[] = [
    {
        value: 0,
        name: 'To Do',
        icon: 'far fa-pause',
        type: 'tertiary'
    },
    {
        value: 1,
        name: 'In Progress',
        icon: 'far fa-clock',
        type: 'primary'
    },
    {
        value: 3,
        name: 'Completed',
        icon: 'far fa-badge-check',
        type: 'success'
    },
];
export let UrgencyList: Urgency[] = [
    {title: 'Low', code: 0, color: 'secondary'},
    {title: 'Normal', code: 1, color: 'primary'},
    {title: 'High', code: 2, color: 'warning'},
    {title: 'Urgent', code: 3, color: 'danger'},
];
