export interface Task {
    id: string;
    title: string;
    labels: string[];
    description: string;
    checkboxes: string[];
    urgency: Urgency;
    creationDate: Date;
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

export interface Project {
    title: string;
    columns: Column[];
}
export interface ProjectWithId extends Project {
    id: string;
}

export interface Urgency {
    title: string;
    color: string;
}
