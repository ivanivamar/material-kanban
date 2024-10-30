export interface Project {
    id: string;
    icon?: string;
    name: string;
    description?: string;
    completed: boolean;
    columns: Column[];
    userId: string;
}

export interface Column {
    id: string;
    name: string;
    tasks: Task[];
}

export interface Task {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    dueDate: Date;
    subtasks: Subtask[];
}

export interface Subtask {
    description: string;
    completed: boolean;
}

export class Project {
    id: string = '';
    icon?: string;
    name: string = '';
    description?: string;
    completed: boolean = false;
    columns: Column[] = [];
    userId: string = '';
}
