export interface Task {
    id: string;
    title: string;
    labels: Labels[];
    description: string;
    checkboxes: Checkboxes[];
    urgency: Urgency;
    creationDate: any;
    modificationDate: any;
    completed: boolean;
    images: string[];
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
    columns: Column[];
}
export interface Urgency {
    title: string;
    color: string;
    code: number;
}
