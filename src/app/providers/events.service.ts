import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private popover = new Subject<any>();
  private isPopover = new Subject<boolean>();

  constructor() { }

  publishPopover(data: any) {
    this.popover.next(data)
  }

  receivePopover(): Subject<any> {
    return this.popover
  }

  publishOnPopover(data: any) {
    this.isPopover.next(data)
  }

  receiveOnPopover(): Subject<any> {
    return this.isPopover
  }
}
