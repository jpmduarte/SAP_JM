import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utente-dashboard',
  templateUrl: './utente-dashboard.component.html',
  styleUrls: ['./utente-dashboard.component.css']
})
export class UtenteDashboardComponent {
  
  show = true;
  showLogoutPopup = false;
  showFormPopup = false;
  showPreviousAssessmentField: boolean = false;
  showSuccessPopup = false;
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
    const blob = new Blob([fileToOpen], { type: fileToOpen.type });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileToOpen.name;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  submitForm() {
    this.showSuccessPopup = true;
  }

  closePopup() {
    this.showSuccessPopup = false;
  }
}
