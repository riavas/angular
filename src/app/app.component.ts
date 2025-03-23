import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent], // Импорт ChatComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  inputUsername = '';
  username = '';

  setUsername() {
    if (this.inputUsername) {
      this.username = this.inputUsername;
      localStorage.setItem('chat_username', this.username);
    }
  }

  editUsername() {
    this.username = '';
    localStorage.removeItem('chat_username');
  }
}