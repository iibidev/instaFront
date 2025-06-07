import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Post } from '../models/post.model';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  url: string = "https://instabackend-production-781c.up.railway.app";
  timeoutEscribiendo: any;

  constructor() {
    this.socket = io(this.url, {
      transports: ['websocket'], // <-- A veces necesario por túneles
    });
  }


  sendText(text: String, idChat: String, idMiembro: String): void {
    this.socket.emit('newText', { text, idChat, idMiembro });
  }

  sendAudio(audioUrl: String, duracion: number, idChat: String, idMiembro: String): void {
    this.socket.emit('newAudio', { audioUrl, duracion, idChat, idMiembro });
  }

  sendPhoto(fotoUrl: String, idChat: String, idMiembro: String): void {
    this.socket.emit('newPhoto', { fotoUrl, idChat, idMiembro });
  }

  sendPost(post: Post, idChat: String, idMiembro: String): void {
    this.socket.emit('newPost', { post, idChat, idMiembro });
  }

  sendReel(reel: Post, idChat: String, idMiembro: String): void {
    this.socket.emit('newReel', { reel, idChat, idMiembro });
  }

  sendPaint(paint: String, idChat: String, idMiembro: String): void {
    this.socket.emit('newPaint', { paint, idChat, idMiembro });
  }

  notificacionMensaje(): Observable<any>{
    return new Observable(observer =>{
      this.socket.on("notificacionMensaje", msg =>{
        observer.next(msg);
      });
    })
  }
  mensajeEntrante(): Observable<any>{
    return new Observable(observer =>{
      this.socket.on("getMessage", msg =>{
        observer.next(msg);
      });
    })
  }

  errorMessage(): Observable<any>{
    return new Observable(observer =>{
      this.socket.on("errorMessage", () =>{
        observer.next(true);
      });
    })
  }

  inputEscribiendo(idChat: String, idMiembro: String) {
    this.socket.emit("escribiendo", { idChat, idMiembro });

    clearTimeout(this.timeoutEscribiendo);
    this.timeoutEscribiendo = setTimeout(() => {
      this.socket.emit("dejoDeEscribir", { idChat, idMiembro });
    }, 3000); // 3 segundos sin teclear = dejó de escribir
  }

  escribiendo(idChat: String): Observable<any>{
    return new Observable(observer =>{
      this.socket.on("escribiendo", (id) => {
        if (idChat == id) {
          observer.next(true);
        }else{
          observer.next(false);
        }
      });
    })
  }

  noEscribiendo(idChat: String): Observable<any>{
    return new Observable(observer =>{
      this.socket.on("dejoDeEscribir", (id) => {
        if (idChat == id) {
          observer.next(false);
        }
      });
    })
  }

  chatCreadoConmigo(): Observable<any>{
    return new Observable(observer =>{
      this.socket.on("chatCreado", (chat) => {
        observer.next(chat);
      });
    })
  }
  
  crearChat(chat: Chat, miembro: string): void{
    this.socket.emit("crearChat", {chat, miembro});
  }

  unirseSala(userId: string){
    this.socket.emit("unirse-sala", userId);
  }

  salirSala(){
    this.socket.emit("salir-sala");
  }

}
