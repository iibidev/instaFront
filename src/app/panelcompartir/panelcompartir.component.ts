import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { Chat } from '../models/chat.model';
import { SocketService } from '../service/socket.service';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-panelcompartir',
  templateUrl: './panelcompartir.component.html',
  styleUrls: ['./panelcompartir.component.css']
})
export class PanelcompartirComponent implements OnInit{

  @Output() cerrarPanel = new EventEmitter();
  @Output() enviar = new EventEmitter();
  @Input() post!: Post;
  chatsArray: Array<Chat> = [];
  chatElegido!: Chat;


  constructor(private chatService: ChatService, private socketService: SocketService){}

  ngOnInit(): void {
    this.chatService.chats$.subscribe(data =>{
      this.chatsArray = data;
    });
  }

  mandar(){
    if(this.post.tipo == "post"){
      this.socketService.sendPost(this.post, this.chatElegido._id, this.chatElegido.miembros[1]._id);
    }else{
      this.socketService.sendReel(this.post, this.chatElegido._id, this.chatElegido.miembros[1]._id);
    }
    this.enviar.emit();
    this.cerrar();
  }

  elegirChat(chatEl: Chat, chatDiv: HTMLElement){
    this.chatElegido = chatEl;
    const chats = document.querySelectorAll(".chats__chat");
    chats.forEach(chat =>{
      chat.classList.remove("elegido");
    });
    chatDiv.classList.add("elegido");
  }

  cerrar(){
    this.cerrarPanel.emit();
  }
}
