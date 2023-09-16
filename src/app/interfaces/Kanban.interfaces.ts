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
    description: string;
    checkboxes: Checkboxes[];
    urgency: any;
    creationDate: any;
    modificationDate: any;
    completed: boolean;
    images: Images[];
    dueDate: Date;
    dayDuration?: number;
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

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

export interface Project {
    id?: string;
    title: string;
    description?: string;
    image?: string;
    columns: Column[];
    uid: string;
    order: number;
    completed?: boolean;
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
