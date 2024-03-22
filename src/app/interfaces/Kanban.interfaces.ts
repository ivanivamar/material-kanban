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
    owner: UserLite;
    assignees: UserLite[];
}

export interface UserLite {
    username: string;
    email: string;
    photoURL: string;
    uid: string;
    sharedProjectsIds: string[];
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
    type: string;
    extension: string;
    color: string;
    trueType: string;
    updatedDate: any;
}

export interface Checkboxes {
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
