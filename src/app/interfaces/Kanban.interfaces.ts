export interface Project {
    id?: string;
    title: string;
    description: string;
    image: string;
    tasks: Task[];
    completed: boolean;
}

export class Project {
    id?: string;
    title: string = '';
    description: string = '';
    image: string = '';
    tasks: Task[] = [];
    completed: boolean = false;
}

export interface Task {
    id?: string;
    title: string;
    labels: any[];
    status: Status;
    description: string;
    subtasks: Subtasks[];
    urgency: Urgency;
    creationDate: string;
    modificationDate: string;
    completed: boolean;
    images: Images[];
    dueDate: string;
    dayDuration?: number;
}

export class TaskDto implements Task {
    id?: string;
    title: string = '';
    labels: any[] = [];
    status: Status = {
        value: 0,
        name: 'To Do',
        icon: 'fa-duotone fa-circle-pause',
        type: 'secondary'
    };
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
        icon: 'pause_circle',
        type: 'secondary',
    },
    {
        value: 1,
        name: 'In Progress',
        icon: 'clock_loader_40',
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
