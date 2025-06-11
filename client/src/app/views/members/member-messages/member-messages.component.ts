import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { IMessage } from 'src/app/core/Models/IMessage';
import { MessageService } from 'src/app/core/services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [CommonModule,TimeagoModule,FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?:NgForm;
  @Input() username?:string;
  // @Input() messages:IMessage[] = [];
  messageContent = '';

constructor(public _messageService:MessageService){}

  ngOnInit(): void {
    // this.loadMessages();
  }


  // loadMessages():void{
  //   if(this.username){
  //     this._messageService.getMessageThread(this.username).subscribe({
  //       next: messages => this.messages = messages
  //     })
  //   }
  // }


  // sendMessage():void{
  //   if(this.username){
  //     this._messageService.sendMessage(this.username,this.messageContent).subscribe({
  //       next: message => {
  //         // this.messages.push(message)
  //         // this.messageForm?.reset();
  //       }
  //     })
  //   }
  // }


sendMessage():void{
    if(this.username){
      this._messageService.sendMessage(this.username,this.messageContent).then( _ =>{
          this.messageForm?.reset();
      })
    }
  }

}
