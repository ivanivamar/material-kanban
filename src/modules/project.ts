export interface Project {
    id: string;
    code: string;
    name: string;
    tasks: Task[];
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    projectId: string;
    name: string;
    description: string;
    completed: boolean;
    status: Status;
    dueDate: string;
    subtasks: Task[];
    createdAt: string;
    updatedAt: string;
}

export class Project {
    id: string = '';
    name: string = '';
    userId: string = '';
    tasks: Task[] = [];
    createdAt: string = new Date().toString();
    updatedAt: string = new Date().toString();
}

export class Task {
    id: string = '';
    name: string = '';
    description: string = '';
    completed: boolean = false;
    status: Status = Status.NOT_STARTED;
    dueDate: string = new Date().toString();
    subtasks: Task[] = [];
    createdAt: string = new Date().toString();
    updatedAt: string = new Date().toString();
}

export enum Status {
    NOT_STARTED = 'Not Started',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed'
}
