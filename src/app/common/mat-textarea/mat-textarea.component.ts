import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'mat-textarea',
    templateUrl: './mat-textarea.component.html',
    styleUrls: ['./mat-textarea.component.sass']
})
export class MatTextareaComponent {
    @ViewChild('textAreaRef') textAreaRef!: ElementRef<HTMLTextAreaElement>;

    @Input() value: any = '';
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() disabled: boolean = false;
    @Input() icon: string = '';
    @Input() showClear: boolean = false;
    @Input() helperText: string = '';
    @Input() showCounter: boolean = false;
    @Input() maxLength: number = 0;
    @Input() required: boolean = false;
    @Input() name: string = '';
    @Input() rows: number = 3;

    @Output() valueChange = new EventEmitter();

    error: boolean = false;
    isFocused: boolean = false;

    constructor() { }

    clear(textArea: HTMLTextAreaElement) {
        this.value = '';
        this.valueChange.emit(this.value);
        if (textArea) {
            textArea.style.height = 'auto';
        }
    }

    onFocus() {
        this.isFocused = true;
    }


    onBlur() {
        this.isFocused = false;
    }

    verifyTextarea() {
        this.error = this.required && this.value.trim().length === 0;

        // check for max length
        if (this.maxLength !== 0 && this.textAreaRef.nativeElement.value.length >= this.maxLength) {
            // trim input to max length
            this.textAreaRef.nativeElement.value = this.textAreaRef.nativeElement.value.substring(0, this.maxLength - 1);
        }
    }

    onInput(textArea: HTMLTextAreaElement) {
        console.log('onInput', this.value);
        if (textArea) {
            textArea.style.overflow = 'hidden';
            textArea.style.height = 'auto';
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    }

}
