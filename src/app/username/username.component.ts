import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-username',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="!username" class="username-container">
      <div class="username-card">
        <input
          [(ngModel)]="inputUsername"
          placeholder="Введите ваше имя"
        />
        <button (click)="setUsername()">Сохранить</button>
      </div>
    </div>

    <div *ngIf="username" class="username-container">
      <div class="username-card">
        <p>Текущее имя: {{ username }}</p>
        <button (click)="editUsername()">Изменить имя</button>
      </div>
    </div>

    <div *ngIf="isEditing" class="username-container">
      <div class="username-card">
        <input
          [(ngModel)]="inputUsername"
          placeholder="Введите новое имя"
        />
        <button (click)="setUsername()">Сохранить</button>
        <button (click)="cancelEdit()">Отмена</button>
      </div>
    </div>
  `,
  styles: [`
    .username-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f5f5f5;
      font-family: Arial, sans-serif;
    }

    .username-card {
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      outline: none;
    }

    button {
      width: 100%;
      padding: 10px;
      background-color: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-bottom: 10px;
    }

    button:hover {
      background-color: #303f9f;
    }
  `]
})
export class UsernameComponent {
  inputUsername = '';
  username = localStorage.getItem('chat_username') || '';
  isEditing = false;

  setUsername() {
    if (this.inputUsername) {
      this.username = this.inputUsername;
      localStorage.setItem('chat_username', this.username);
      this.isEditing = false;
    }
  }

  editUsername() {
    this.isEditing = true;
    this.inputUsername = this.username;
  }

  cancelEdit() {
    this.isEditing = false;
  }
}