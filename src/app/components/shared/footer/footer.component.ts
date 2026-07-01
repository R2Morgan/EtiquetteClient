import { Component, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { calendarNumber, heart, home, personCircle, searchOutline } from 'ionicons/icons';
import {
  IonTabBar, IonTabButton,
  IonIcon, NavController, IonImg
} from '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {User} from "../../../models/User";
import {ApiService} from "../../../services/api-service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonIcon, IonImg, NgIf],
})
export class FooterComponent {
  private navCtrl = inject(NavController);
  private router = inject(Router);
  private apiService = inject(ApiService);

  protected user: User | null = null;

  constructor() {
    addIcons({ personCircle, searchOutline, calendarNumber, home, heart });
    this.apiService.getMe().subscribe(
      user => {
        this.user = user;
        console.log(this.user);
      }
    );
  }

  navigate(path: string) {
    this.navCtrl.navigateRoot(path, { animated: false });
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }
}
