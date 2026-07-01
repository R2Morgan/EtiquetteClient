import {Component, inject, OnInit} from '@angular/core';
import {FooterComponent} from "../shared/footer/footer.component";
import {HeaderComponentComponent} from "../shared/header/header-component.component";
import {ApiService} from "../../services/api-service";
import {AuthService} from "../../services/auth-service";
import {IonContent, IonIcon, IonSpinner, IonToast, NavController} from "@ionic/angular/standalone";
import {User} from "../../models/User";
import {addIcons} from "ionicons";
import {
  cameraOutline,
  diamondOutline,
  logOutOutline,
  personOutline,
  ribbonOutline,
  shirtOutline,
  starOutline, trophyOutline
} from "ionicons/icons";
import {slideAnimation} from "../../animations/fade-right.animation";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgIf} from "@angular/common";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  imports: [
    FooterComponent,
    HeaderComponentComponent,
    IonIcon,
    FormsModule,
    IonContent,
    NgClass,
    DatePipe,
    NgIf,
    IonToast,
    IonSpinner
  ]
})
export class AccountComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private navCtrl = inject(NavController);

  user: User | null = null;
  editFirstName = '';
  editLastName = '';
  editEmail = '';
  saving = false;
  isToastOpen = false;
  toastMessage = "The profile picture must be under 10Mb!";
  loading = false;

  constructor() {
    addIcons({
      personOutline, cameraOutline, diamondOutline,
      logOutOutline, ribbonOutline, starOutline, shirtOutline, trophyOutline
    });
  }

  ngOnInit() {
    this.setActiveUser();
  }

  setActiveUser(){
    this.loading = true;
    this.apiService.getMe().subscribe(data => {
      this.user = data;
      this.editFirstName = data.firstName;
      this.editLastName = data.lastName;
      this.editEmail = data.email;
      this.loading = false;
    });
  }

  membershipName(): string {
    switch (this.user?.membershipType) {
      case 0: return 'Neck Tie';
      case 1: return 'Black Tie';
      case 2: return 'White Tie';
      default: return 'No Membership';
    }
  }

  membershipIcon(): string {
    switch (this.user?.membershipType) {
      case 0: return 'ribbon-outline';
      case 1: return 'star-outline';
      case 2: return 'trophy-outline';
      default: return 'ribbon-outline';
    }
  }

  membershipClass(): string {
    switch (this.user?.membershipType) {
      case 0: return 'tier-neck';
      case 1: return 'tier-black';
      case 2: return 'tier-white';
      default: return '';
    }
  }

  saveChanges() {
    this.saving = true;
    if(this.user && this.user.id){
      this.apiService.updateUser(this.user.id, this.editFirstName, this.editLastName).subscribe(
        data => {
          setTimeout(() => {
            this.setActiveUser();
            this.saving = false;
          }, 1000);
        }
      );
    }
  }

  async changeProfilePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    if (image.webPath && this.user) {
      const response = await fetch(image.webPath);
      const blob = await response.blob();

      this.apiService.uploadProfilePicture(this.user.id, blob).subscribe({
        next: (res) => {
          this.setActiveUser();
        },
        error: (err) => this.setOpen(true)
      });
    }
  }

  goToMembership() {
    this.navCtrl.navigateForward('/membership', {
      animation: slideAnimation('back')
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('logout success, navigating...');
        window.location.href = '/login';
      },
      error: (err) => {
        console.log('logout error:', err);
      }
    });
  }

  protected setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
