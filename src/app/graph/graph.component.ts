import { Component } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent {
    cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    selectedCity = this.cities[0];
    graphLinks = [
        {
            id: 'a',
            source: 'first',
            target: 'second',
        }, {
            id: 'b',
            source: 'second',
            target: 'c1',
        },{
            id: 'c',
            source: 'c1',
            target: 'c2',
        }, {
            id: 'd',
            source: 'first',
            target: 'd',
        }
    ];
    graphNodes = [
        {
            id: 'first',
            label: 'A',
            dimension: { width: 300, height: 200 },
            position: { x: 0, y: 0 }
        }, {
            id: 'second',
            label: 'B',
            dimension: { width: 300, height: 200 },
            position: { x: 500, y: 0 }
        }, {
            id: 'c1',
            label: 'C1',
            dimension: { width: 300, height: 200 },
        }, {
            id: 'c2',
            label: 'C2',
            dimension: { width: 300, height: 200 },
        }, {
            id: 'd',
            label: 'D',
            dimension: { width: 300, height: 200 },
            position: { x: 800, y: 0 }
        }
    ];

    array = [1, 2, 3, 4, 5];
}
