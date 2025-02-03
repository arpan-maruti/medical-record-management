import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-view-and-label',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-and-label.component.html',
  styleUrls: ['./view-and-label.component.css']
})
export class ViewAndLabelComponent {
  @Input() selectedFiles: { name: string; icon: string }[] = [];;
  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();

  fileLabels: string[] = []; 

  constructor() {}

  close() {
    this.closePopup.emit();
  }

  updateLabel(index: number, label: string) {
    this.fileLabels[index] = label;
  }
}

