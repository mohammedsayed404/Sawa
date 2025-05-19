import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMember } from 'src/app/core/Models/IMember';
import { MembersService } from 'src/app/core/services/members.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { FormsModule } from '@angular/forms';
import { IPagination } from 'src/app/core/Models/IPagination';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, ButtonsModule,
    MemberCardComponent,FormsModule,PaginationModule],
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent  implements OnInit {
members:IMember[] = [];
pageNumber=1;
pageSize=5;
pagination:IPagination |undefined;
predicate = 'liked';
  constructor(private _membersService:MembersService  ,private cd: ChangeDetectorRef ) {}


  ngOnInit(): void {
    this.loadLikes();
  }


  loadLikes():void{
    this._membersService.GetLikes(this.predicate,this.pageNumber,this.pageSize).subscribe({
      next: response => {
        if(response.result && response.pagination ){
          this.members = response.result;
          this.pagination = response.pagination
        //  this.cd.detectChanges(); // to make it scan again after updated my array of members

        }
      }
    })
  }

    pageChanged(event: PageChangedEvent) {
      this.pageNumber = event.page;
      this.loadLikes();
  }


}
