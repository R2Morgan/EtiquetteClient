import {Component, inject, OnInit} from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon, IonLabel, IonTabButton,
  IonTitle,
  IonToolbar,
  NavController
} from "@ionic/angular/standalone";
import {slideAnimation} from "../../../animations/fade-right.animation";
import {addIcons} from "ionicons";
import {addCircleOutline} from "ionicons/icons";
import {ApiService} from "../../../services/api-service";
import {NgIf} from "@angular/common";

@Component({
    selector: 'header-component',
    templateUrl: './header-component.component.html',
    styleUrls: ['./header-component.component.scss'],
  imports: [
    IonButtons,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonTabButton,
    NgIf
  ]
})
export class HeaderComponentComponent  implements OnInit {

  private navCtrl = inject(NavController);
  private apiService = inject(ApiService);

  isAdmin = false;

  constructor() {
    addIcons({
      addCircleOutline
    });
    this.apiService.getMe().subscribe(data => {
      this.isAdmin = data.isAdmin;
    });
  }

  ngOnInit() {}

  goToAddNewPost() {
    this.navCtrl.navigateForward('/add-new-post', {
      animation: slideAnimation('forward')
    });
  }


}
