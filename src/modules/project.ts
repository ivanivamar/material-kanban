export interface Project {
    id: string;
    name: string;
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
    image?: string;
    name: string = '';
    description?: string;
    completed: boolean = false;
    columns: Column[] = [];
    userId: string = '';
}
