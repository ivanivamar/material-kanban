import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[ripple]'
})
export class RippleDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    onPress(event: MouseEvent) {
        const element = this.el.nativeElement;

        // add class ripple-parent to the element
        this.renderer.addClass(element, 'ripple-parent');
        // remove all ripples
        const ripples = element.querySelectorAll('.ripple');
        ripples.forEach((ripple: any) => {
            this.renderer.removeChild(element, ripple);
        });

        // Create the ripple element
        const ripple = this.renderer.createElement('span');
        this.renderer.addClass(ripple, 'ripple');

        // Append the ripple to the element
        this.renderer.appendChild(element, ripple);

        // Calculate size and position
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        this.renderer.setStyle(ripple, 'width', `${size}px`);
        this.renderer.setStyle(ripple, 'height', `${size}px`);
        this.renderer.setStyle(ripple, 'left', `${x}px`);
        this.renderer.setStyle(ripple, 'top', `${y}px`);

        // Remove ripple after animation
        ripple.addEventListener('animationend', () => {
            this.renderer.removeChild(element, ripple);
            this.renderer.removeClass(element, 'ripple-parent');
        });
    }
}
