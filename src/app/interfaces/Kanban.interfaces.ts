export interface Project {
    id?: string;
    title: string;
    description: string;
    image: string;
    tasks: Task[];
    completed: boolean;
    ownerId: string;
    created: string;
    updated: string;
}

export class Project {
    id?: string;
    title: string = '';
    description: string = '';
    image: string = '';
    tasks: Task[] = [];
    completed: boolean = false;
    ownerId: string = '';
    created: string = new Date().toString();
    updated: string = new Date().toString();
}

export interface Task {
    id: string;
    title: string;
    labels: any[];
    status: number;
    description: string;
    subtasks: Subtasks[];
    urgency: Urgency;
    creationDate: string;
    modificationDate: string;
    completed: boolean;
    images: Images[];
    dueDate: string;
    dayDuration?: number;
    show?: boolean;
}

export class Task implements Task {
    id: string = '';
    title: string = '';
    labels: any[] = [];
    status: number = 0;
    description: string = '';
    subtasks: Subtasks[] = [];
    urgency: Urgency = {
        title: 'Low',
        color: 'secondary',
        code: 0
    };
    creationDate: string = new Date().toString();
    modificationDate: string = new Date().toString();
    completed: boolean = false;
    images: Images[] = [];
    dueDate: string = '';
    dayDuration?: number = 0;
    show?: boolean = false;
}

export interface UserLite {
    username: string;
    email: string;
    photoURL: string;
    uid: string;
    sharedProjectsIds: string[];
}

export interface Status {
    value: number;
    name: string;
    icon: string;
    type: string;
}

export interface Images {
    name: string;
    url: string;
    type: string;
    extension: string;
    color: string;
    trueType: string;
    updatedDate: any;
}

export interface Subtasks {
    id: string;
    title: string;
    description: string;
    checked: boolean;
}

export interface Labels {
    name: string;
    color: string;
    background: string;
    code: string;
}

export interface Urgency {
    title: string;
    color: string;
    code: number;
}

// Auth:
export interface Register {
    username: string;
    email: string;
    password: string;
}

export interface Login {
    email: string;
    password: string;
}

export interface IDropdownOption {
    value: any;
    icon?: string;
    iconColor?: string;
    label: string;
    selected?: boolean;
}

export let StatusList = [
    {
        value: 0,
        name: 'To Do',
        icon: 'fa-duotone fa-circle-pause',
        type: 'secondary',
    },
    {
        value: 1,
        name: 'In Progress',
        icon: 'fa-duotone fa-circle-play',
        type: 'primary',
    },
    {
        value: 2,
        name: 'Review',
        icon: 'draw',
        type: 'warning',
    },
    {
        value: 3,
        name: 'Completed',
        icon: 'verified',
        type: 'success',
    },
];

export let UrgencyList: Urgency[] = [
    {title: 'Low', code: 0, color: 'secondary'},
    {title: 'Normal', code: 1, color: 'primary'},
    {title: 'High', code: 2, color: 'warning'},
    {title: 'Urgent', code: 3, color: 'danger'},
];
