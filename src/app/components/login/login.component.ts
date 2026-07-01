import {Component, inject} from '@angular/core';
import {IonButton, IonInput, IonToast, NavController} from "@ionic/angular/standalone";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {ApiService} from "../../services/api-service";
import {EMLoginResponseStatus} from "../../models/LoginObject";
import {TokenService} from "../../services/token-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    IonInput,
    FormsModule,
    IonButton,
    RouterLink,
    ReactiveFormsModule,
    IonToast
  ]
})
export class LoginComponent {

  private apiService = inject(ApiService);
  private navCtrl = inject(NavController);
  private tokenService = inject(TokenService);

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9](?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{2,29}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    ])
  });

  isToastOpen = false;
  toastMessage = "Something went wrong.";

  constructor() { }

  login() {
    if (!this.loginForm.valid) return;

    const username = this.loginForm.value.username!;
    const password = this.loginForm.value.password!;

    this.apiService.loginUser(username, password).subscribe({
      next: (response) => {
        if (response.status === EMLoginResponseStatus.LOGIN_SUCCESS) {
          this.tokenService.setTokens(response.accessToken, response.refreshToken);
          this.navCtrl.navigateForward('/home', { animated: false });
        }
      },

      error: (err) => {
        if (err.status === 401) {
          this.toastMessage = "The username or password is incorrect.";
          this.setOpen(true);
        } else {
          this.toastMessage = "Something went wrong.";
          this.setOpen(true);
        }
      }
    });
  }

  protected setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
