import { Injectable, NgZone } from '@angular/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';
import { GlobaldataService } from './globaldata.service';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  notifications: PushNotificationSchema[] = [];
  remoteToken: string = '';

  constructor(
    private zone: NgZone,
    public general: GeneralService
  ) {
    if (Capacitor.isNativePlatform()) {
      this.pushListener();
    }
  }

  pushListener() {
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      this.zone.run(() => {
        this.notifications.push(notification);
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        if (action.notification.data.type == 'Post') {
          this.zone.run(() => {
            this.general.goToPage('/to/buy/' + action.notification.data.id)
          });
        } else if (action.notification.data.type == 'user') {
          this.zone.run(() => {
            this.general.goToPage('/to/usr/' + action.notification.data.id + '/profile');
          });
        }
      }
    );
  }

  getToken() {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.requestPermissions().then(async (permission) => {
        if (permission.receive == "granted") {
          // Register with Apple / Google to receive push via APNS/FCM
          if (Capacitor.getPlatform() == 'ios') {
            await PushNotifications.register();
            FCM.getToken().then((result) => {
              this.remoteToken = result.token;
              GlobaldataService.deviceToken = result.token;
            }).catch((err) => console.log('i am Error', err));
          } else {
            FCM.getToken().then((result) => {
              this.remoteToken = result.token;
              GlobaldataService.deviceToken = result.token;
            }).catch((err) => console.log('i am Error', err));
          }
        } else {
          // No permission for push granted
          alert('No Permission for Notifications!')
        }
      });
    }
  }

}