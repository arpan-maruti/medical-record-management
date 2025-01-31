import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-files',
  imports: [CommonModule],
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent {
  @Output() closePopup = new EventEmitter<void>();
  @Output() fileUploaded = new EventEmitter<string>(); // Emit the file name after upload
  file: File | null = null;  // Store the uploaded file
  fileName: string = '';     // Store the file name to display

  // Handle when files are selected via the file input
  onFilesSelected(event: any) {
    const selectedFile = event.target.files[0];  // Get the first file
    if (selectedFile) {
      this.file = selectedFile;
      this.fileName = selectedFile.name;  // Store the file name
      this.fileUploaded.emit(this.fileName); // Emit the file name to parent
    }
  }

  // Handle when files are dropped into the drag-and-drop area
  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];  // Get the first file
    if (file) {
      this.file = file;
      this.fileName = file.name;  // Store the file name
      this.fileUploaded.emit(this.fileName); // Emit the file name to parent
    }
  }

  // Handle the dragover event (to indicate drop zone)
  onDragOver(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  // Handle the dragleave event (to remove drop zone indication)
  onDragLeave(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const modal = document.querySelector('.upload-container');
    if (modal && !modal.contains(event.target as Node)) {
      this.closeModal(); // Close the modal if the click is outside
    }
  }
  // Close modal
  closeModal() {
    this.closePopup.emit();
  }
}
