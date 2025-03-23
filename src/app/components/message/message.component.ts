import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../services/chat.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  @Input() message!: Message; // Входное свойство для сообщения
  @Output() delete = new EventEmitter<void>(); // Выходное событие для удаления

  deleteMessage() {
    this.delete.emit(); // Вызываем событие удаления
  }
}