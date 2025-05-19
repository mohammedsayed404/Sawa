import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMember } from 'src/app/core/Models/IMember';
import { RouterLink } from '@angular/router';
import { MembersService } from 'src/app/core/services/members.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent {

  @Input() member:IMember | undefined;

  constructor(private _membersService:MembersService , private _toastrService:ToastrService){}


  AddLike(member:IMember):void{
    this._membersService.AddLike(member.userName).subscribe({
      next: _ => this._toastrService.success(`you have liked ${member.knownAs}`)
    })
  }


}
