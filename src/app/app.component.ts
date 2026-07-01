import {Component, inject} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {Router} from "@angular/router";
import {App} from "@capacitor/app";
import {StatusBar, Style} from "@capacitor/status-bar";
import {SplashScreen} from "@capacitor/splash-screen";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private router = inject(Router);

  constructor() {
    this.initDeepLinks();
  }

  async ngOnInit() {
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: Style.Light });
    await SplashScreen.hide({ fadeOutDuration: 500 });
  }

  initDeepLinks() {
    App.addListener('appUrlOpen', (event) => {

      const url = new URL(event.url);

      if (url.pathname === '/reset-password') {
        const token = url.searchParams.get('token');

        this.router.navigate(['/reset-password'], {
          queryParams: { token }
        });
      }
    });
  }
}
