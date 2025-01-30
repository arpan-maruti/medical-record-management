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
  @Input() selectedFiles: any[] = [];  // Input for the list of files
  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>(); // To notify parent to close the pop-up

  fileLabels: string[] = [];  // New property to hold the labels for the files

  constructor() {}

  close() {
    this.closePopup.emit();
  }

  // Update the labels if needed
  updateLabel(index: number, label: string) {
    this.fileLabels[index] = label;
  }
}

