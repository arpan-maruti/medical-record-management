import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-dialogue',
  imports: [MatDialogContent, MatDialogModule],
  templateUrl: './logout-dialogue.component.html',
  styleUrl: './logout-dialogue.component.css'
})
export class LogoutDialogueComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutDialogueComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ){
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
  
}
