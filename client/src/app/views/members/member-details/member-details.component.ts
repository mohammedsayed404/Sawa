import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMember } from 'src/app/core/Models/IMember';
import { MembersService } from 'src/app/core/services/members.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryModule,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/core/services/message.service';
import { IMessage } from 'src/app/core/Models/IMessage';
import { PresenceService } from 'src/app/core/services/presence.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { take } from 'rxjs';
import { IUser } from 'src/app/core/Models/IUser';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    NgxGalleryModule,
    TimeagoModule,
    MemberMessagesComponent,
  ],
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('memberTaps', { static: true }) memberTaps?: TabsetComponent;
  // member: IMember | undefined;
  member: IMember = {} as IMember;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab?: TabDirective;
  messages: IMessage[] = [];
  user?: IUser;

  constructor(
    private _membersService: MembersService,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _messageService: MessageService,
    public _presenceService: PresenceService,
    private _router:Router
  ) {
    // using here cause ngOninit it too late cause i made it static ViewChild
    this._authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });

    this._router.routeReuseStrategy.shouldReuseRoute = () => false // i will change it later
  }

  ngOnDestroy(): void {
    this._messageService.stopHubConnection();
  }
  ngOnInit(): void {
    // this.loadMemberByName();
    //using resover instead of this method

    this._activatedRoute.data.subscribe({
      next: (data) => (this.member = data['member']),
    });
    // console.log(this._activatedRoute.snapshot.params['id']);
    // console.log(this._activatedRoute);
    this._activatedRoute.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab(params['tab']);
      },
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];

    this.galleryImages = this.GetImages(); //cause we don't using loadmembers any more


  }

  GetImages(): NgxGalleryImage[] {
    if (!this.member) return [];
    const imageUrls: NgxGalleryImage[] = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
      });
    }
    return imageUrls;
  }

  // loadMemberByName(): void {
  //   const userName = this._activatedRoute.snapshot.paramMap.get('username');
  //   if (!userName) return;

  //   this._membersService.GetMemberByUsername(userName).subscribe({
  //     next: (member) => {
  //       this.member = member;
  //       this.galleryImages = this.GetImages();
  //     },
  //   });
  // }

  loadMessages(): void {
    if (this.member) {
      this._messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages,
      });
    }
  }

  onTabActivated(data: TabDirective): void {
    this.activeTab = data;
    if (this.activeTab.heading == 'Messages' && this.user) {
      // this.loadMessages();
      //using our hub
      this._messageService.createHubConnection(this.user, this.member.userName);
    } else this._messageService.stopHubConnection();
  }

  selectTab(heading: string): void {
    if (this.memberTaps) {
      this.memberTaps.tabs.find((t) => t.heading === heading)!.active = true;
    }
  }
}
