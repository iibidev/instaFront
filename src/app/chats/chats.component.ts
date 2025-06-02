import { Component, OnInit } from '@angular/core';
import { RutasService } from '../service/rutas.service';
import { ChatService } from '../service/chat.service';
import { Chat } from '../models/chat.model';
import { UserService } from '../service/user.service';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit{

  chats: Array<Chat> = [];
  usuario: String = "";
  chatElegido: boolean = false;

  constructor(private mostrarHeader: RutasService, private chatService: ChatService,
    private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.mostrarHeader.setMostrarHeader(false);
    this.userService.getPerfil().subscribe(data =>{
      this.usuario = data?.usuario;
    });
    this.chatService.cargarChats();
    this.chatService.chats$.subscribe(data =>{
      this.chats = data;
    });

    //Mostrar chat y quitar el panel que sale si no se elige un chat.
    if(this.activatedRoute.children.length > 0){
      this.chatElegido = true;
    }
  }

  irInicio(){
    this.router.navigate([""]);
  }

  irChat(idChat: string){
    this.chatElegido = true;
    this.router.navigate(["chats/" + idChat]);
  }
}
