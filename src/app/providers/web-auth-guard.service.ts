import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Observable } from 'rxjs';
import { GeneralService } from './general.service';
import { StorageService } from './storage.service';
import { HttpService } from './http.service';
import { EventsService } from './events.service';
import { AnalyticsService } from './analytics.service';
import { GlobaldataService } from './globaldata.service';

@Injectable({
  providedIn: 'root'
})
export class WebAuthGuardService {

  private isLoggedIn: boolean = false;

  storage = inject(StorageService);
  general = inject(GeneralService);
  http = inject(HttpService);
  events = inject(EventsService);
  analytics = inject(AnalyticsService);


  constructor() {
    this.events.receiveIsLogout().subscribe((res: boolean) => {
      if (res == true) {
        this.isLoggedIn = false;
      }
    })
  }

  checkLoginStatus(): boolean {
    return this.isLoggedIn;
  }

  canActivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.isLoggedIn) {
      return true;
    }

    return new Promise(async (resolve, reject) => {
      let loginToken = await this.storage.getObject('login_token');
      if (loginToken) {
        GlobaldataService.loginToken = loginToken;
        this.http.get('GetUserDetails', false).subscribe({
          next: async (res2: any) => {
            if (res2.status == true) {
              GlobaldataService.userObject = res2.data;
              await this.storage.setObject('CBREuserObject', res2.data);
              await this.analytics.setUserId(res2.data.user_id)
              await this.analytics.logEvent('app_open', { user_id: res2.data.user_id })
              this.isLoggedIn = true;
              resolve(true);
            } else {
              await this.storage.clear();
              reject(true)
            }
          },
          error: async (err) => {
            await this.storage.clear()
            reject(true);
            this.general.goToRoot('web-login')
          }
        })
      } else {
        reject(false);
        this.general.goToRoot('web-login')
      }
    });
  }
}

export const WebAuthGuard: CanActivateFn = (route, state) => {
  return inject(WebAuthGuardService).canActivate();
};
