import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-view-and-label',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-and-label.component.html',
  styleUrls: ['./view-and-label.component.css']
})
export class ViewAndLabelComponent {
  @Input() selectedFiles: any[] = [];
  @Output() closePopup = new EventEmitter<void>();
  @Output() labelSave = new EventEmitter<{ fileId: string, newLabel: string }>();
  @Output() previewPdf = new EventEmitter<any>();

  onPreview(file: any) {
    // Directly emit the file object so the parent can open the PDF preview
    this.previewPdf.emit(file);
  }

  onSave(file: any) {
    this.labelSave.emit({ fileId: file.id, newLabel: file.label });
  }

  onClose() {
    this.closePopup.emit();
  }
}