// filepath: /home/arpan/Desktop/medical-record-management/src/app/components/view-and-label/view-and-label.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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

  goToFileDetails(file: any) {
    // Navigate to the file-details page with the file id as a route parameter
    this.router.navigate(['/case-management/file-details', file.id]);
  }
}