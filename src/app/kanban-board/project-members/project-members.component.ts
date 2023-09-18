import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserLite} from "../../interfaces/Kanban.interfaces";
import {count} from "rxjs";
import {KanbanService} from "../../kanban-service.service";

@Component({
    selector: 'app-project-members',
    templateUrl: './project-members.component.html',
    styleUrls: ['./project-members.component.sass'],
    providers: [KanbanService],
})
export class ProjectMembersComponent implements OnInit {
    @Input() members: UserLite[] = [];
    @Input() owner: UserLite = {} as UserLite;
    @Input() isUserOwner: boolean = false;

    @Output() onChangeSubmit: EventEmitter<any> = new EventEmitter<any>();

    membersList: UserLite[] = [];
    searchMember: string = '';

    showModal: boolean = false;
    showModalRemove: boolean = false;

    newMemberEmail: string = '';
    addMemberErrorMessage: string = '';

    selectedMember: any = null

    users: UserLite[] = [];

    constructor(
        private kanbanService: KanbanService,
    ) {
    }

    ngOnInit(): void {
        this.membersList = JSON.parse(JSON.stringify(this.members));

        this.kanbanService.getUsers().subscribe(users => {
            this.users = users;
        });
    }

    membersCount(): string {
        let text = '';
        if (this.members.length === 0) {
            text = '1 member';
        } else {
            text = `${this.members.length + 1} members`;
        }
        return text;
    }

    searchMembers(): void {
        if (this.searchMember.trim().length === 0) {
            this.membersList = this.members;
        } else {
            this.membersList = this.members.filter(member => {
                return member.username.toLowerCase().includes(this.searchMember.toLowerCase()) ||
                    member.email.toLowerCase().includes(this.searchMember.toLowerCase());
            });
        }
    }

    removeMember(): void {
        this.members = this.members.filter(m => m.uid !== this.selectedMember.uid);
        this.onChangeSubmit.emit(this.members);
        this.showModalRemove = false;
        this.selectedMember = null;
    }

    addMember(): void {
        // Check if user exists in members list or owner
        if (this.members.find(member => member.email === this.newMemberEmail) ||
            this.owner.email === this.newMemberEmail) {
            this.addMemberErrorMessage = 'User already exists in project';
            return;
        }

        // Check if user exists in database
        const user = this.users.find(user => user.email === this.newMemberEmail);
        if (!user) {
            this.addMemberErrorMessage = 'User does not exist';
            return;
        }

        // Add user to members list
        this.members.push(user);
        this.showModal = false;
        this.newMemberEmail = '';
        this.onChangeSubmit.emit(this.members);
    }
}
