import firebase from "firebase/compat";
import User = firebase.User;

export interface Organization {
    id: string;
    title: string;
    icon: string;
    uid: string;
    users: any[];
    projects: Project[];
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
    owner: UserLite;
    assignees: UserLite;
    activity: Activity[];
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
    owner: UserDto = new UserDto();
    assignees: UserDto = new UserDto();
    activity: Activity[] = [];
}

export interface Activity {
    icon: string;
    user: UserLite;
    action: string;
    date: string;
}

export interface UserLite {
    username: string;
    email: string;
    photoURL: string;
    uid: string;
    sharedProjectsIds: string[];
}

export class UserDto implements UserLite {
    username: string = '';
    email: string = '';
    photoURL: string = '';
    uid: string = '';
    sharedProjectsIds: string[] = [];
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

export interface Project {
    id?: string;
    title: string;
    description: string;
    image: string;
    tasks: Task[];
    completed: boolean;
    owner: UserLite;
	ownerId: string;
    members: UserLite[];
    membersIds: string[];
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
