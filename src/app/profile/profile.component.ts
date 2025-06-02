import { Component } from '@angular/core';
import { RutasService } from '../service/rutas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { Perfil } from '../models/perfil.model';
import { FollowService } from '../service/follow.service';
import { ChatService } from '../service/chat.service';
import { Chat } from '../models/chat.model';
import { SocketService } from '../service/socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  perfil!: Perfil;
  siguiendo: boolean = false;
  mostrarAvisoLogOut: boolean = false;
  mostrarEditar: boolean = false;
  descripcionFinal!: SafeHtml;
  mostrarPosts: boolean = true;
  chat!: Chat;
  loader: boolean = false;
  modal: boolean = false;

  codigoQR = "";
  mostrarQR: boolean = false;

  constructor(private mostrarHeader: RutasService, private route: ActivatedRoute,
    private userService: UserService, private tituloPagina: Title,
    private followService: FollowService, private sanitizer: DomSanitizer,
    private chatService: ChatService, private router: Router,
    private socketService: SocketService
  ){}

  ngOnInit(): void {
    this.mostrarHeader.setMostrarHeader(true);
    this.route.paramMap.subscribe(params => {
      const usuario = params.get('usuario') || "";
      const is_me = usuario == "me";

      if(!is_me){
        this.userService.userProfile({ usuario }).subscribe({
          next: data =>{
            if(data.ok){
              this.perfil = data;
              this.perfil.descripcion = this.perfil.descripcion.replaceAll('\\n', '<br>');
              this.descripcionFinal = this.sanitizer.bypassSecurityTrustHtml(
                this.perfil.descripcion.replace(/@(\w+)/g, (match, username) => {
                  return `<a href="/perfil/${username}" style="all: unset; cursor: pointer; color: var(--azul);">@${username}</a>`;
                })
              );
              this.siguiendo = this.perfil.sigues;
              this.tituloPagina.setTitle(`Instagram - ${this.perfil.usuario}`);
              this.codigoQR = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + window.location.href;
            }else{
              alert(data.error);
            }
          },
          error: error =>{
            console.log("Error en la petición");
          }
        })
      }else{
        this.userService.getPerfil().subscribe({
          next: data =>{
            if(data){
              this.perfil = data;
              this.perfil.descripcion = this.perfil.descripcion.replaceAll('\\n', '<br>');
              this.descripcionFinal = this.sanitizer.bypassSecurityTrustHtml(
                this.perfil.descripcion.replace(/@(\w+)/g, (match, username) => {
                  return `<a href="/perfil/${username}" style="all: unset; cursor: pointer; color: var(--azul);">@${username}</a>`;
                })
              );
              this.tituloPagina.setTitle(`Instagram - ${this.perfil.usuario}`);
              this.codigoQR = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + window.location.href;
            }
          },
          error: error =>{
            console.log(error);
          }
        });
    }
  });
}

  seguir(){
    this.followService.seguirUsuario(this.perfil._id).subscribe({
      next: data =>{
        if(data.ok){
          this.siguiendo = data.sigues;
          this.perfil.seguidores = this.siguiendo ? 
          this.perfil.seguidores + 1 : this.perfil.seguidores - 1;
        }else{
          console.log(data.error);
        }
      },
      error: error =>{
        console.log(error);
      }
    });
  }

  cerrarSesion(){
    this.userService.cerrarSesion();
    this.chatService.borrarChats();
    this.socketService.salirSala();
  }

  crearChat(){
    this.loader = true;
    this.chatService.crearChat(this.perfil._id).subscribe({
      next: data =>{
        if(data.ok){
          this.loader = false;
          this.chat = data.chat;
          if(data.nuevo){
            this.chatService.anadirChat(this.chat);
            this.socketService.crearChat(this.chat, this.chat.miembros[1]._id);
          }
          this.router.navigate(["chats/" + this.chat._id]);
        }else{
          this.loader = false
          this.modal = true;
        }
      },
      error: error =>{
        console.log(error);
        this.loader = false
        this.modal = true;
      }
    });
  }
}
