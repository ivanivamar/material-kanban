import { Component, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'mat-input',
  templateUrl: './mat-input.component.html',
  styleUrls: ['./mat-input.component.sass']
})
export class MatInputComponent {
    @ViewChild('inputRef') inputRef!: ElementRef;

    @Input() value: any = null;
    @Input() placeholder: string = '';
    @Input() label: string = '';
    @Input() disabled: boolean = false;
    @Input() icon: string = '';
    @Input() showClear: boolean = false;
    @Input() inputType: string = 'text';
    @Input() helperText: string = '';
    @Input() showCounter: boolean = false;
    @Input() maxLength: number = 0;
    @Input() required: boolean = false;
    @Input() name: string = '';
    @Input() showPassword: boolean = false;
    @Input() autofocus: boolean = false;

    @Output() valueChange = new EventEmitter();
    @Output() onClear = new EventEmitter();

    error: boolean = false;
    isFocused: boolean = false;
    showingPassword: boolean = false;

    constructor() {}

    clear() {
        this.value = this.inputType === 'number' ? 0 : '';
        this.valueChange.emit(this.value);
        this.onClear.emit();
    }

    onFocus() {
        this.isFocused = true;
        console.log(this.label)
    }

    onBlur() {
        this.isFocused = false;
    }

    isFocus(): boolean {
        let hasValue = false;

        if (this.value !== null && this.value !== undefined) {
            hasValue = this.value.toString().trim().length > 0;
        }

        return this.isFocused || hasValue;
    }

    togglePassword() {
        this.showingPassword = !this.showingPassword;
        if (this.showingPassword) {
            this.inputType = 'text';
        } else {
            this.inputType = 'password';
        }
    }

    verifyInput() {
        this.error = false;
        if (this.required && this.value.trim().length === 0) {
            this.error = true;
        }

        // check for max length
        if (this.maxLength !== 0 && this.inputRef.nativeElement.value.length >= this.maxLength) {
            // trim input to max length
            this.inputRef.nativeElement.value = this.inputRef.nativeElement.value.substring(0, this.maxLength - 1);
        }
        switch (this.inputType) {
            case 'email':
                // check for valid email
                if (!this.validateEmail(this.value)) {
                    this.error = true;
                }
                break;
            case 'password':
                // check for valid password
                if (!this.validatePassword(this.value)) {
                    this.error = true;
                }
                break;
            case 'text':
                // check for valid password
                if (this.showingPassword) {
                    if (!this.validatePassword(this.value)) {
                        this.error = true;
                    }
                }
                break;
            default:
                break;
        }
    }

    validateEmail(email: string) {
        // check for valid email
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    validatePassword(password: string) {
        // at least one lowercase letter, one uppercase letter, one number, and at least 8 characters
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return re.test(password);
    }
}
