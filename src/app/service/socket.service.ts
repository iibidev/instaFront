import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  url: string = "http://localhost:3000";

  constructor() {
    this.socket = io(this.url, {
      transports: ['websocket'], // <-- A veces necesario por túneles
    });
  }

  // Enviar un mensaje
  sendMessage(message: String): void {
    this.socket.emit('newMessage', message);
  }

  // Escuchar mensajes entrantes
  getMessages(): Observable<String> {
    return new Observable(observer => {
      this.socket.on('sendMessage', (data: string) => {
        observer.next(data);
      });
    });
  }

}
