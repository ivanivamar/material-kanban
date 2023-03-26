export interface Task {
    title: string;
    labels: string[];
    description: string;
    checkboxes: string[];
    urgency: Urgency;
    creationDate: Date;
}

export interface Column {
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
