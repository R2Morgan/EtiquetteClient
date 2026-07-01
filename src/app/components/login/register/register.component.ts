import {Component, inject} from '@angular/core';
import {IonButton, IonInput, IonToast} from "@ionic/angular/standalone";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {ApiService} from "../../../services/api-service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    IonInput,
    IonButton,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    IonToast
  ]
})
export class RegisterComponent {

  private apiService = inject(ApiService);
  private router = inject(Router);

  isToastOpen = false;

  constructor() { }

  registerForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-zÀ-ž]+(?:[ -][A-Za-zÀ-ž]+)*$/)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-zÀ-ž]+(?:[ -][A-Za-zÀ-ž]+)*$/)
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9](?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{2,29}$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^0\d{9}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  });

  get formValid() {
    return this.registerForm.valid;
  }

  get passwordsMatch(): boolean {
    return this.registerForm.value.password === this.registerForm.value.confirmPassword;
  }

  registerUser() {
    const username = this.registerForm.value.username;
    const firstName = this.registerForm.value.firstName;
    const lastName = this.registerForm.value.lastName;
    const email = this.registerForm.value.email;
    const phone = this.registerForm.value.phone;
    const password = this.registerForm.value.password;
    this.apiService.checkUserExists(username!, email!).subscribe(
      response => {
        if(response == true){
          this.setOpen(true);
        } else {
          this.apiService.addUser(username!, firstName!, lastName!, email!, phone!, password!).subscribe(
            response => {
              this.router.navigate(['/success'],
                {
                  queryParams: {
                    successMessage: "User has been created successfully."
                  }
                });
            }
          );
        }
      }
    )
  }

  protected setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
