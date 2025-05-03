import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMember } from 'src/app/core/Models/IMember';
import { IUser } from 'src/app/core/Models/IUser';
import { MembersService } from 'src/app/core/services/members.service';
import { take } from 'rxjs';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [CommonModule,FormsModule,TabsModule],
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event'])unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: IMember | undefined;
  user: IUser | null = null;

  constructor(private _authService: AuthService,
    private _membersService: MembersService,
  private _toastrService:ToastrService) {}

ngOnInit(): void {
  this.loadMember();
}

loadMember():void {
this.GetCurrentUser();
    if(!this.user) return;
    this._membersService.GetMemberByUsername(this.user.userName).subscribe({
      next: member => this.member = member,
    });
  }
GetCurrentUser():void {
  this._authService.currentUser$.pipe(take(1)).subscribe({
    next: user => this.user = user
    });
}

UpdateMember():void {

  this._membersService.UpdateMember(this.editForm?.value).subscribe({
    next: _ =>{
      this._toastrService.success('Member updated successfully');
      this.editForm?.reset(this.member);

    },
  })

}



}
