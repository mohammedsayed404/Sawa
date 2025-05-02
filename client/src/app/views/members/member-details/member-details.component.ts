import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMember } from 'src/app/core/Models/IMember';
import { MembersService } from 'src/app/core/services/members.service';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [CommonModule,TabsModule,NgxGalleryModule ],
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

member:IMember |undefined;
galleryOptions:NgxGalleryOptions[] = [];
galleryImages:NgxGalleryImage[] = [];

constructor(private _membersService:MembersService , private _activatedRoute:ActivatedRoute) {}
  ngOnInit(): void {

    // console.log(this._activatedRoute.snapshot.params['id']);
    // console.log(this._activatedRoute);
    this.loadMemberByName();
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
    ];

    this.galleryImages = this.GetImages();
  }


  GetImages(): NgxGalleryImage[] {
    if(!this.member) return [];
    const imageUrls:NgxGalleryImage[] = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      });
    }
    return imageUrls;
  }

loadMemberByName():void {
  const userName = this._activatedRoute.snapshot.paramMap.get('username');
  if(!userName) return ;

  this._membersService.GetMemberByUsername(userName).subscribe({
    next: member => {
      this.member = member;
      this.galleryImages = this.GetImages();
    },
  });

}


}
