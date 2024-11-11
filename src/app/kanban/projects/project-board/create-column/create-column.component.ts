import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Column, Project} from '../../../../../modules/project';
import {FirebaseServiceService} from '../../../../../services/firebase-service.service';

@Component({
    host: {
        '(document:click)': 'checkClickOutside($event)',
    },
    selector: 'app-create-column',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './create-column.component.html',
    styleUrl: './create-column.component.css',
    providers: [FirebaseServiceService]
})
export class CreateColumnComponent {
    @Input() project: Project = new Project();

    @Output() onCreate = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    columnName = '';
    colorArray = ['#FFF3BD', '#FFD9E6', '#CEF2F2', '#FFF3BD', '#FFCEA0', '#D9DDFF'];

    constructor(
        private firebaseService: FirebaseServiceService,
        private _eref: ElementRef
    ) {
    }

    createColumn() {
        let column: Column = {
            id: this.firebaseService.generateId(),
            name: this.columnName,
            color: this.colorArray[this.project.columns.length % this.colorArray.length],
            tasks: []
        };
        this.project.columns.push(column);
        this.project.updatedAt = new Date();

        this.firebaseService.createProject(this.project).then(() => {
            this.columnName = '';
            this.onClose.emit();
        });
    }

    // detect Enter key press
    onKeyPress(event: KeyboardEvent) {
        if (this.firebaseService.isNullOrEmpty(this.columnName)) {
            return;
        }

        if (event.key === 'Enter') {
            this.createColumn();
        }
    }

    checkClickOutside(event: Event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.columnName = '';
            this.onClose.emit();
        }
    }
}
