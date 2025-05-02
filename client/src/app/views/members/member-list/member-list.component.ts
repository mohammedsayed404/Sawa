import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersService } from 'src/app/core/services/members.service';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/core/Models/IUser';
import { IMember } from 'src/app/core/Models/IMember';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit  , OnDestroy{
members:IMember[] = [];

  constructor(private _membersService:MembersService) {}


  ngOnInit(): void {
    this.loadMembers();
  }


  loadMembersSubscription:Subscription = new Subscription();


  loadMembers():void {
    this.loadMembersSubscription = this._membersService.GetMembers().subscribe({
      next: members => this.members = members,
    });
  }




  ngOnDestroy(): void {
    this.loadMembersSubscription.unsubscribe();
  }



}
