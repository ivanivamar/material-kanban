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
    id: string;
    title: string;
    labels: any[];
    status: Status;
    description: string;
    checkboxes: Checkboxes[];
    urgency: Urgency;
    creationDate: any;
    modificationDate: any;
    completed: boolean;
    images: Images[];
    dueDate: Date;
    dayDuration?: number;
    owner?: any;
    assignee?: any;
}

export interface Status {
    name: string;
    icon: string;
    bgColor: string;
    borderColor: string;
    iconColor: string;
}

export interface Images {
    name: string;
    url: string;
}

export interface Checkboxes {
    id: string;
    title: string;
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
    description?: string;
    image?: string;
    tasks: Task[];
    uid: string;
    order: number;
    completed: boolean;
    sharedWith: User[];
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
