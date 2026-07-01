import {bootstrapApplication} from '@angular/platform-browser';
import {RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';

import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./app/core/interceptors/auth.interceptor";
import {defineCustomElements} from "@ionic/pwa-elements/loader";
import {TokenService} from "./app/services/token-service";

const tokenService = new TokenService();

async function initApp() {
  console.log('main.ts: starting initApp');
  await tokenService.init();
  console.log('main.ts: tokenService.init() complete, access token:', tokenService.getAccessToken());

  await bootstrapApplication(AppComponent, {
    providers: [
      {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
      { provide: TokenService, useValue: tokenService },
      provideHttpClient(withInterceptors([authInterceptor])),
      provideIonicAngular(),
      provideRouter(routes, withPreloading(PreloadAllModules))
    ],
  });

  console.log('main.ts: bootstrap complete');
  defineCustomElements(window);
}

initApp();
