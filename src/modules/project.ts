export interface Project {
    id: string;
    name: string;
    columns: Column[];
    userId: string;
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface Subtask {
    id: string;
    description: string;
    completed: boolean;
}

export class Project {
    id: string = '';
    name: string = '';
    userId: string = '';
    columns: Column[] = [];
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}

export class Column {
    id: string = '';
    name: string = '';
    tasks: Task[] = [];
}

export class Task {
    id: string = '';
    name: string = '';
    description: string = '';
    completed: boolean = false;
    dueDate: Date = new Date();
    subtasks: Subtask[] = [];
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}
