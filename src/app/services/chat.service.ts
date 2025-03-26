import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  author: string;
  text: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private username = '';
  private chatChannel: BroadcastChannel | null = null;
  private usernameChannel: BroadcastChannel | null = null;

  messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.initChannels();
    this.loadInitialData();
  }

  private initChannels(): void {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.chatChannel = new BroadcastChannel('chat_channel');
        this.usernameChannel = new BroadcastChannel('username_channel');

        this.chatChannel.onmessage = (event) => {
          if (event.data.type === 'NEW_MESSAGE') {
            this.addMessage(event.data.message);
          }
        };

        this.usernameChannel.onmessage = (event) => {
          if (event.data.type === 'UPDATE_USERNAME') {
            this.setUsername(event.data.username, false);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported', e);
      }
    }
  }

  private loadInitialData(): void {
    if (typeof localStorage !== 'undefined') {
      this.username = localStorage.getItem('chat_username') || '';
      const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
      this.messagesSubject.next(messages);
    }
  }

  setUsername(username: string, broadcast = true): void {
    this.username = username;
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chat_username', username);
    }
    
    if (broadcast && this.usernameChannel) {
      this.usernameChannel.postMessage({
        type: 'UPDATE_USERNAME',
        username
      });
    }
  }

  sendMessage(text: string): void {
    const message: Message = {
      author: this.username || 'Аноним',
      text: text.trim(),
      timestamp: new Date()
    };
    
    this.addMessage(message);
    
    if (this.chatChannel) {
      this.chatChannel.postMessage({
        type: 'NEW_MESSAGE',
        message
      });
    }
  }

  private addMessage(message: Message): void {
    const messages = [...this.messagesSubject.value, message];
    this.messagesSubject.next(messages);
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }

  ngOnDestroy(): void {
    this.chatChannel?.close();
    this.usernameChannel?.close();
  }
}