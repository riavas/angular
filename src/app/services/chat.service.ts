import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  constructor() {}

  sendMessage(text: string) {
    const username = localStorage.getItem('chat_username') || 'Аноним';
    const message: Message = {
      author: username,
      text: text,
      timestamp: new Date(), // Сохраняем текущее время
    };
    const messages = [...this.messagesSubject.value, message];
    this.messagesSubject.next(messages);
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }

  loadMessages() {
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    this.messagesSubject.next(messages);
  }

  deleteMessage(index: number) {
    const messages = this.messagesSubject.value.filter((_, i) => i !== index);
    this.messagesSubject.next(messages);
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }
}