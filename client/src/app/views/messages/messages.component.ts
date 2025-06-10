import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMessage } from 'src/app/core/Models/IMessage';
import { IPagination } from 'src/app/core/Models/IPagination';
import { MessageService } from 'src/app/core/services/message.service';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimeagoModule } from 'ngx-timeago';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule,FormsModule,ButtonsModule,TimeagoModule,PaginationModule,RouterLink],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

messages:IMessage[] = [];
pagination?:IPagination;
container = 'Unread';
pageNumber=1;
pageSize = 5;
loading= false;


constructor(private _messageService:MessageService){}

  ngOnInit(): void {
    this.loadMessages();
  }

loadMessages():void{
  this.loading = true;
  this._messageService.getMessages(this.pageNumber,this.pageSize,this.container).subscribe({
    next: response =>{
      if(response.result && response.pagination){
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      }
    }
  })
}

deleteMessage(messageId:number):void{
  this._messageService.deleteMessage(messageId).subscribe({
    next: _ => this.messages.splice(this.messages.findIndex( m => m.id === messageId),1)
  })
}

  pageChanged(event: PageChangedEvent) {
    if(!this.messages) return;
    // console.log(event.page);
    // console.log(this.pageNumber);

   if(event.page !== this.pageNumber){ // to prevent infinit loop cause ngModle change from reponse and fire event again
     this.pageNumber = event.page; //pageNumber ==> mean current page at this time
     this.loadMessages();

   }
}


}
