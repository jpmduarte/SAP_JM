import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utente-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './utente-dashboard.component.html',
  styleUrls: ['./utente-dashboard.component.css']
})
export class UtenteDashboardComponent {
  
  show = true;
  showLogoutPopup = false;
  showFormPopup = false;
  showPreviousAssessmentField: boolean = false;
  files: File[] = [];

  constructor(private router: Router) {}

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  toggleFormPopup() {
    this.showFormPopup = !this.showFormPopup;
    this.show = !this.show;
  }

  logout(): void {
    this.showLogoutPopup = false;
    this.router.navigate(['/login']);
  }

  onSubmissionStatusChange(value: string): void {
    if (value === 'sim') {
      this.showPreviousAssessmentField = true;
    } else {
      this.showPreviousAssessmentField = false;
    }
  }

  onFileChange(event: any) {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      this.files.push(selectedFiles[i]);
    }
  }

  removeFile(file: File) {
    const index = this.files.indexOf(file);
    if (index !== -1) {
      this.files.splice(index, 1);
    }
  }

  openFile(fileToOpen: File) {
    // Create a new blob object
    const blob = new Blob([fileToOpen], { type: fileToOpen.type });
    
    // Create a link element
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set link's href to point to the Blob URL
    link.href = url;
    link.download = fileToOpen.name;
    
    // Append link to the body
    document.body.appendChild(link);
    
    // Dispatch click event on the link
    // This will download the file
    link.click();
    
    // Remove link from body
    document.body.removeChild(link);
    
    // Release the Blob URL
    window.URL.revokeObjectURL(url);
  }
}
