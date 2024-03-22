import {Status, Urgency} from "./Kanban.interfaces";
import {ProjectTabs} from "../kanban-board/project-details.component";

export class Project implements Project {
    statusList: Status[];
    labelsList: any[];
    urgencyList: Urgency[];

    constructor() {
        this.statusList = [
            {
                name: 'To Do',
                icon: 'pause_circle',
                iconColor: '#000000',
                bgColor: '#F3F4F6',
                borderColor: '#EAEBEF',
            },
            {
                name: 'In Progress',
                icon: 'clock_loader_40',
                iconColor: '#045FF3',
                bgColor: '#EFF6FF',
                borderColor: '#C9E1FE',
            },
            {
                name: 'Review',
                icon: 'draw',
                iconColor: '#FFB800',
                bgColor: '#FFF6E5',
                borderColor: '#FFEACD',
            },
            {
                name: 'Completed',
                icon: 'verified',
                iconColor: '#00B341',
                bgColor: '#F0FFF0',
                borderColor: '#C9F9C9',
            }
        ];
        this.labelsList = [
            {name: 'FRONTEND', color: '#2E7DFF', background: '#F2F7FD', code: 'frontend'},
            {name: 'TS', color: '#FDAF1B', background: '#FFFBF2', code: 'ts'},
            {name: 'TRANSLATIONS', color: '#FD6860', background: '#FFF6F7', code: 'translations'},
            {name: 'BUGFIX', color: '#2E7DFF', background: '#F2F7FD', code: 'bugfix'},
        ];
        this.urgencyList = [
            {title: 'Low', code: 0, color: '#DBDBDE'},
            {title: 'Normal', code: 1, color: '#2E7DFF'},
            {title: 'High', code: 2, color: '#FDC33E'},
            {title: 'Urgent', code: 3, color: '#FC6252'},
        ];
    }
}
