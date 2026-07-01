import {Component, inject} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  NavController, IonFooter, IonTabs, IonTabBar, IonTabButton
} from '@ionic/angular/standalone';
import {NgIf} from "@angular/common";
import { slideAnimation} from "../../animations/fade-right.animation";
import {addIcons} from "ionicons";
import {library, notificationsOutline, playCircle, radio, search} from "ionicons/icons";
import {FooterComponent} from "../shared/footer/footer.component";
import {HeaderComponentComponent} from "../shared/header/header-component.component";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../services/api-service";
import {PushNotifications} from "@capacitor/push-notifications";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FooterComponent, HeaderComponentComponent],
})
export class HomePage {

  private navCtrl = inject(NavController);
  private http = inject(HttpClient);
  private apiService = inject(ApiService);

  username: string = "";

  constructor() {
    addIcons({
      notificationsOutline,
      library,
      playCircle,
      radio,
      search
    });

    this.apiService.getMe().subscribe(data => {
      this.username = data.firstName + " " + data.lastName;
      this.initPushNotifications();
    });

  }

  async initPushNotifications() {
    console.log('INIT PUSH');

    await PushNotifications.addListener('registration', (token) => {
      console.log('TOKEN:', token.value);
      this.apiService.savePushToken(token.value).subscribe({
        next: () => console.log('Saved token'),
        error: (err) => console.error(err)
      });
    });

    await PushNotifications.addListener('registrationError', (error) => {
      console.log('ERROR:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received in foreground: ', notification);
    });

    const permission = await PushNotifications.checkPermissions();
    console.log('PERMISSION:', permission);

    let result = permission;
    if (permission.receive !== 'granted') {
      result = await PushNotifications.requestPermissions();
    }

    if (result.receive === 'granted') {
      console.log('REGISTERING...');
      await PushNotifications.register();
      console.log('REGISTER CALLED');
    }
  }
}
