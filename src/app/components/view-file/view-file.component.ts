import { Component } from '@angular/core';

@Component({
  selector: 'app-view-file',
  imports: [],
  templateUrl: './view-file.component.html',
  styleUrl: './view-file.component.css'
})
export class ViewFileComponent {
  isModalVisible: boolean = false;
  pdfSrc: string = '';

  viewLOI(): void {
    // Set the PDF source URL (replace with actual LOI PDF file location)
    this.pdfSrc = 'assets/files/q.pdf'; // Modify this path as per your use case.
    
    // Show the modal
    this.isModalVisible = true;
    document.body.classList.add('modal-active'); // Apply blur effect on body
  }

  closeModal(): void {
    // Hide the modal
    this.isModalVisible = false;
    document.body.classList.remove('modal-active'); // Remove blur effect on body
  }
}
