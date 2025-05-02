import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMember } from 'src/app/core/Models/IMember';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent {

  @Input() member:IMember | undefined;




}
