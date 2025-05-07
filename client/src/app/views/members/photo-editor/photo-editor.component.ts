import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMember } from 'src/app/core/Models/IMember';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { IUser } from 'src/app/core/Models/IUser';
import { AuthService } from 'src/app/core/services/auth.service';
import { take } from 'rxjs';
import { IPhoto } from 'src/app/core/Models/IPhoto';
import { MembersService } from 'src/app/core/services/members.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [CommonModule,FileUploadModule],
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
@Input()  member:IMember | undefined;
uploader:FileUploader | undefined;
hasBaseDropZoneOver:boolean = false;
baseUrl:string = environment.apiUrl;
user:IUser | undefined;
constructor(private _authService:AuthService , private _membersService:MembersService) {}


  ngOnInit(): void {
    this._authService.currentUser$.pipe(take(1)).subscribe({
      next:user => {
        if(user) this.user = user;
      }
    })

    this.initializeUploader();
  }

  SetMainPhoto(photo:IPhoto):void{
    this._membersService.SetMainPhoto(photo.id).subscribe({
      next: _ =>{
        if(this.user && this.member){
          this.user.photoUrl = photo.url;
          // to update every thing about user for all subscriber components
          this._authService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          //update btn at same time also
          this.member.photos.forEach( p => {
            if(p.isMain) p.isMain = false;
            if(p.id === photo.id) p.isMain = true;
          })

        }
      }
    })
  }

  DeletePhoto(photoId:number):void{
    this._membersService.DeletePhoto(photoId).subscribe({
      next:_ =>{
        if(this.member)
        this.member.photos = this.member.photos.filter(photo => photo.id !== photoId);
      }
    })
  }

  fileOverBase(event:any):void{
    this.hasBaseDropZoneOver = event;
  }

  initializeUploader():void{
    this.uploader = new FileUploader({
      url:`${this.baseUrl}/users/add-photo`,
      authToken:`Bearer ${this.user?.token}`,
      isHTML5:true,
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize: 10 * 1024 * 1024
    });

   this.uploader.onAfterAddingFile = file =>{
    file.withCredentials = false;
   }

   this.uploader.onSuccessItem = (items,response,status,headers) =>{
      if(response){
        const photo:IPhoto = JSON.parse(response);
        this.member?.photos.push(photo);
        if(photo.isMain && this.user && this.member){
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this._authService.setCurrentUser(this.user);
        }
      }
   }
  }

}
