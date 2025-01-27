import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports:[FormsModule,CommonModule],
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
})
export class CustomAlertComponent {
  @Input() title: string = 'Alert';
  @Input() message: string = '';
  @Input() confirmText: string = 'OK';

  @Output() confirm = new EventEmitter<void>();

  isVisible: boolean = false;

  show(message: string, title: string = 'Alert', confirmText: string = 'OK'): void {
    this.title = title;
    this.message = message;
    this.confirmText = confirmText;
    this.isVisible = true;
  }

  hide(): void {
    this.isVisible = false;
  }

  onConfirm(): void {
    this.confirm.emit();
    this.hide();
  }
}
