import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-circular-progress-bar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.sass']
})
export class CircularProgressBarComponent implements OnChanges {
    @Input() value = 0;

    circumference = 2 * Math.PI * 45; // Circumference of the circle (2 * π * radius)
    circleOffset = this.circumference;

    ngOnChanges(changes: SimpleChanges): void {
        if ('value' in changes) {
            this.circleOffset = this.calculateCircleOffset();
        }
    }

    private calculateCircleOffset(): number {
        const percentage = this.value / 100;
        return this.circumference * (1 - percentage);
    }
}
