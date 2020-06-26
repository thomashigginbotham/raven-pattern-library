import { Injectable, EventEmitter } from '@angular/core';

export interface ComponentMessage {
  id: string;
  content: any;
}

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  messages: EventEmitter<ComponentMessage>;

  constructor() {
    this.messages = new EventEmitter(true);
  }

  sendMessage(message: ComponentMessage) {
    this.messages.emit(message);
  }
}
