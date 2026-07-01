import {Component, inject, OnInit} from '@angular/core';
import {FooterComponent} from "../shared/footer/footer.component";
import {HeaderComponentComponent} from "../shared/header/header-component.component";
import {
  IonButton, IonContent,
  IonHeader,
  IonIcon, IonImg,
  IonItem, IonLabel,
  IonList, IonSpinner,
  IonTitle,
  IonToolbar,
  NavController
} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {callOutline, chevronBackOutline, ellipse, logoWhatsapp, personCircleOutline} from "ionicons/icons";
import {slideAnimation} from "../../animations/fade-right.animation";
import {Observable} from "rxjs";
import {User} from "../../models/User";
import {ApiService} from "../../services/api-service";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  imports: [
    IonButton,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonContent,
    NgForOf,
    NgIf,
    IonSpinner
  ]
})
export class MembersComponent implements OnInit {

  private navCtrl = inject(NavController);
  private apiService = inject(ApiService);

  protected activeMembers : User[] = [];
  loading = false;

  constructor() {
    addIcons({ 'chevron-back-outline': chevronBackOutline,
      ellipse,
      callOutline,
      personCircleOutline,
      logoWhatsapp
    });
    this.getMembers();
  }

  ngOnInit() {}

  goBack() {
    this.navCtrl.back({ animation: slideAnimation('back') });
  }

  getMembers() {
    this.loading = true;
    this.apiService.getUsers().subscribe(
      (users: User[]) => {
        this.activeMembers = users;
        this.loading = false;
      }
    )
  }

  tierName(type: number): string {
    switch (type) {
      case 0: return 'Neck Tie';
      case 1: return 'Black Tie';
      case 2: return 'White Tie';
      default: return '';
    }
  }

  openWhatsApp(phone: string) {
    const cleaned = phone.replace(/[\s\-\+]/g, '');
    window.open(`https://wa.me/4${cleaned}`, '_blank');
  }
}
