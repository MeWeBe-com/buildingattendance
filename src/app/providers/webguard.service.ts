import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Observable } from 'rxjs';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class WebguardService {

  general = inject(GeneralService);

  constructor() { }

  canActivate(): boolean | Observable<boolean> {
    if (Capacitor.isNativePlatform()) {
      return true;
    } else {
      this.general.goToRoot('web-login');
      return false
    }
  }

}

export const WebGuard: CanActivateFn = (route, state) => {
  return inject(WebguardService).canActivate();
};