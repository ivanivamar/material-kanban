import { ProjectWithId } from '../interfaces/Kanban.interfaces';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { collection, doc, Firestore } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.sass'],
  providers: []
})
export class KanbanBoardComponent implements OnInit {
  project: ProjectWithId = {} as ProjectWithId;
  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params == null || params['project'] == null) {
        this.router.navigate(['/dashboard']);
      } else {
        this.project = JSON.parse(params['project']);
        console.log('%c Project: ', 'background: #222; color: #bada55', this.project);
      }
    });
  }
}
