import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }


  setUserId = async (id: any) => {
    await FirebaseAnalytics.setUserId({
      userId: id,
    });
  };

  setCurrentScreen = async (name: string) => {
    await FirebaseAnalytics.setCurrentScreen({
      screenName: name
    });
  };

  logEvent = async (name: string, data: any) => {
    await FirebaseAnalytics.logEvent({
      name: name,
      params: data,
    });
  };

  setSessionTimeoutDuration = async () => {
    await FirebaseAnalytics.setSessionTimeoutDuration({
      duration: 120,
    });
  };

  setEnabled = async () => {
    await FirebaseAnalytics.setEnabled({
      enabled: true,
    });
  };

  isEnabled = async () => {
    const { enabled } = await FirebaseAnalytics.isEnabled();
    return enabled;
  };

  resetAnalyticsData = async () => {
    await FirebaseAnalytics.resetAnalyticsData();
  };
}