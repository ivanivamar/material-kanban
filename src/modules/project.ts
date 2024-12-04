export interface Project {
    id: string;
    name: string;
    tasks: Task[];
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Task {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    status: Status;
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
    tasks: Task[] = [];
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}

export class Task {
    id: string = '';
    name: string = '';
    description: string = '';
    completed: boolean = false;
    status: Status = Status.NOT_STARTED;
    dueDate: Date = new Date();
    subtasks: Subtask[] = [];
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}

export class Subtask {
    id: string = '';
    description: string = '';
    completed: boolean = false;
}

export enum Status {
    NOT_STARTED = 'Not Started',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed'
}
