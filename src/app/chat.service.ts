import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

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
  messages$ = this.messagesSubject.asObservable();
  private broadcastChannel: BroadcastChannel | null = null;
  private destroy$ = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initBroadcastChannel();
      this.loadMessages();
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.broadcastChannel?.close();
  }

  private initBroadcastChannel(): void {
    this.broadcastChannel = new BroadcastChannel('chat_channel');
    
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'NEW_MESSAGE') {
        const messages = [...this.messagesSubject.value, event.data.message];
        this.messagesSubject.next(messages);
        localStorage.setItem('chat_messages', JSON.stringify(messages));
      } else if (event.data.type === 'DELETE_MESSAGE') {
        const messages = this.messagesSubject.value.filter((_, i) => i !== event.data.index);
        this.messagesSubject.next(messages);
        localStorage.setItem('chat_messages', JSON.stringify(messages));
      }
    };
  }

  sendMessage(text: string): void {
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
      
      this.broadcastChannel?.postMessage({
        type: 'NEW_MESSAGE',
        message: message
      });
    }
  }

  loadMessages(): void {
    if (isPlatformBrowser(this.platformId)) {
      const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
      this.messagesSubject.next(messages);
    }
  }

  deleteMessage(index: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const messages = this.messagesSubject.value.filter((_, i) => i !== index);
      this.messagesSubject.next(messages);
      localStorage.setItem('chat_messages', JSON.stringify(messages));
      
      this.broadcastChannel?.postMessage({
        type: 'DELETE_MESSAGE',
        index: index
      });
    }
  }
}