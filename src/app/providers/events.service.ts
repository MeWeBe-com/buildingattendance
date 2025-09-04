import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private popover = new Subject<any>();

  constructor() { }

  publishPopover(data: any) {
    this.popover.next(data)
  }

  receivePopover(): Subject<any> {
    return this.popover
  }
}
