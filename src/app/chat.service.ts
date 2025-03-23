import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Message {
  author: string;
  text: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  sendMessage(text: string) {
    if (isPlatformBrowser(this.platformId)) {
      const username = localStorage.getItem('chat_username') || 'Аноним';
      const message: Message = {
        author: username,
        text: text,
        timestamp: new Date(),
      };
      const messages = [...this.messagesSubject.value, message];
      this.messagesSubject.next(messages);
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }

  loadMessages() {
    if (isPlatformBrowser(this.platformId)) {
      const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
      this.messagesSubject.next(messages);
    }
  }

  deleteMessage(index: number) {
    if (isPlatformBrowser(this.platformId)) {
      const messages = this.messagesSubject.value.filter((_, i) => i !== index);
      this.messagesSubject.next(messages);
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }
}