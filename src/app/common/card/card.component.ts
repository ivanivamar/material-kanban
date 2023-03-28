import { Component, Input } from '@angular/core';
import { Task } from 'src/app/interfaces/Kanban.interfaces';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass']
})
export class CardComponent {
    @Input() task: Task | undefined;
}
