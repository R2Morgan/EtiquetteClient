import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {IonButton, IonInput, IonToast} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../../../services/api-service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [
    IonInput,
    FormsModule,
    IonButton,
    RouterLink,
    IonToast
  ]
})
export class ResetPasswordComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private router = inject(Router);

  password: string = '';
  confirmPassword: string = '';
  token: string | null = null;
  isToastOpen = false;
  toastMessage: string = "Password reset successfully.";

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  passwordValid(): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(this.password);
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  get formValid(): boolean {
    return (
      this.passwordValid() &&
      this.passwordsMatch() &&
      this.password.length > 0
    );
  }

  resetPassword() {
    if (this.password !== this.confirmPassword) return;

    this.apiService.resetPassword(this.token!, this.password)
      .subscribe({
        next: (res) => {
          this.toastMessage = res;
          this.setOpen(true);

          if (res === "Password updated successfully") {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  protected setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
