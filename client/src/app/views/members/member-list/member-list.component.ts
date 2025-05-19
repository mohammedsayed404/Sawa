import { UserParams } from './../../../core/Models/UserParams';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersService } from 'src/app/core/services/members.service';
import { IMember } from 'src/app/core/Models/IMember';
import { MemberCardComponent } from "../member-card/member-card.component";
import { IPagination } from 'src/app/core/Models/IPagination';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent ,
    PaginationModule,FormsModule , ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit  , OnDestroy{

// members:IMember[] = [];
// members$:Observable<IMember[]> | undefined;
members:IMember[] = [];
pagination:IPagination |undefined;
userParams:UserParams |undefined;
genderList = [{value:'male' , display:'Males'},{value:'female' , display:'Females'}]
  constructor(private _membersService:MembersService  ,private cd: ChangeDetectorRef ) {}


  ngOnInit(): void {

    this.userParams = this._membersService.getUserParams();

    this.loadMembers();

    // this.members$ = this._membersService.GetMembers();
  }

    loadMembers():void {

     if(this.userParams){
       this._membersService.setUserParams(this.userParams)
      this._membersService.GetMembers(this.userParams).subscribe({
      next:(response)=>{
        if(response.result && response.pagination)
          this.members = response.result;
          this.pagination = response.pagination;
          // console.log(this.pagination);

         this.cd.detectChanges(); // to make it scan again after updated my array of members

      },
    });
     }
  }

  pageChanged(event: PageChangedEvent) {
    if(!this.userParams) return;

    this.userParams.pageNumber = event.page;
    this.loadMembers();
}

resetFilters():void{
  this.userParams = this._membersService.resetUserParams();
  //and then calling loadmemebers() from form cause it submit btn

}

  // loadMembersSubscription:Subscription = new Subscription();


  // loadMembers():void {
  //   this.loadMembersSubscription = this._membersService.GetMembers().subscribe({
  //     next: members => this.members = members,
  //   });
  // }




  ngOnDestroy(): void {
    // this.loadMembersSubscription.unsubscribe();
  }



}
