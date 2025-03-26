import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  @Input() message!: Message; // Входное свойство для сообщения
  @Output() delete = new EventEmitter<void>();

  deleteMessage() {
    this.delete.emit(); // Вызываем событие удаления
  }
}