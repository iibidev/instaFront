import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat } from '../models/chat.model';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  url: string = "http://localhost:3000/chat";

  chatsSubject = new BehaviorSubject<Array<Chat>>([]);
  chats$ = this.chatsSubject.asObservable();

  constructor(private http: HttpClient, private socketService: SocketService) { 
    this.cargarChats();
  }

  cargarChats(){
    this.http.get<any>(this.url + "/getAll").subscribe({
      next: data =>{
        this.chatsSubject.next(data.result);
      },
      error: error =>{
        console.log(error);
      }
    });
  }

  recogerUnChat(idChat: string): Observable<any>{
    return this.http.get<any>(this.url + "/getOne/" + idChat);
  }

  cargarMensajes(idChat: string): Observable<any>{
    return this.http.get<any>(this.url + "/messages/" + idChat);
  }

  crearChat(idMiembro: string): Observable<any>{
    return this.http.post(this.url + "/create", { usuario: idMiembro });
  }

  borrarChats(){
    this.chatsSubject.next([]);
  }

  anadirChat(chat: Chat){
    const chats = this.chatsSubject.value;
    chats.unshift(chat);
    this.chatsSubject.next(chats);
  }

  subirACloudinary(formData: FormData, tipo: String): Observable<any>{
    return this.http.post(`https://api.cloudinary.com/v1_1/dzwufjd9o/${tipo}/upload`, formData);
  }
}
