import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async setObject(key: string, value: any) {
    await Preferences.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  async getObject(key: string) {
    const val: any = await Preferences.get({ key: key });
    return JSON.parse(val.value);
  }

  async removeItem(key: string) {
    await Preferences.remove({ key: key });
  }

  async clear() {
    await Preferences.clear();
  }

}