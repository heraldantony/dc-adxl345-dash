import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket; // The client instance of socket.io
  private dataResponseCallback: any;
  private listeners: any = {};

  constructor() {
    this.socket = io('http://localhost:4200');
  }

  // emit event
  emitEvent(eventTopic, dataOptions) {
      this.socket.emit(eventTopic,  dataOptions);
  }

  // add listener for topic
  addListener(eventTopic, cb) {
    this.removeListener(eventTopic);

    this.listeners[eventTopic] = cb;
    this.socket.on(eventTopic, (data) => {
      // console.log(data);
       this.listeners[eventTopic](data);
    });
  }

  removeListener(eventTopic) {
    if(this.listeners[eventTopic]) {
       this.socket.removeListener(eventTopic, this.listeners[eventTopic]);
    }
    this.listeners[eventTopic] = null;
  }
    
}

