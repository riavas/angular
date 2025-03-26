import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-username',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.css']
})
export class UsernameComponent {
  inputUsername = '';

  constructor(public chatService: ChatService) {}

  setUsername(): void {
    if (this.inputUsername.trim()) {
      this.chatService.setUsername(this.inputUsername.trim());
      this.inputUsername = '';
    }
  }
}