import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {IonButton, IonInput} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {ApiService} from "../../../services/api-service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    FormsModule,
    IonInput,
    IonButton,
    RouterLink
  ]
})
export class ForgotPasswordComponent {

  private apiService = inject(ApiService);
  private router = inject(Router);

  email: any;

  constructor() {
  }

  get emailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  sendReset() {
    if (!this.emailValid) return;
    this.apiService.requestPasswordReset(this.email).subscribe();
    this.router.navigate(['/success'],
      {
        queryParams: {
          successMessage: "If an account exists, a reset link has been sent."
        }
      });
  }
}
