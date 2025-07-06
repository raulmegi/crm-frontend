import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="fab" (click)="clicked.emit()" aria-label="Nueva Tarea">
      ＋
    </button>
  `,
  styles: [`
    .fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color:rgb(22, 22, 92);
      color: white;
      font-size: 32px;
      border: none;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      cursor: pointer;
      z-index: 1000;
    }
    .fab:hover {
      background-color:rgb(7, 37, 65);
    }
  `]
})
export class FabComponent {
  @Output() clicked = new EventEmitter<void>();
}
