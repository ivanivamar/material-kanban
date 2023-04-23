import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[ripple]'
})
export class RippleDirective {
    @HostBinding('class.ripple') addRipple = true;

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const circle = document.createElement('span');
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;
        const left = event.clientX - target.offsetLeft - radius;
        const top = event.clientY - target.offsetTop - radius;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${left}px`;
        circle.style.top = `${top}px`;
        circle.classList.add('ripple-effect');

        target.appendChild(circle);

        setTimeout(() => target.removeChild(circle), 500);
    }
}
