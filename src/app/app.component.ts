import { ChangeDetectorRef, Component } from '@angular/core';
import { SocketService } from './service/socket.service';
import { RutasService } from './service/rutas.service';
import { UserService } from './service/user.service';
import { ChatService } from './service/chat.service';
import { Notificacion } from './models/Noti.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navBar: boolean = false;
  notificaciones: Array<Notificacion> = [];
  mostrarError: boolean = false;

  constructor(private socketService: SocketService, 
    private mostrarHeader: RutasService, 
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private chatService: ChatService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.mostrarHeader.mostrarHeader$.subscribe(data =>{
      this.navBar = data;
      this.cdRef.detectChanges();
    });

    this.socketService.chatCreadoConmigo().subscribe(chat =>{
      this.chatService.anadirChat(chat);
    });

    this.socketService.errorMessage().subscribe(data =>{
      this.mostrarError = data;
    });

    this.socketService.notificacionMensaje().subscribe(data =>{
      if(!this.router.url.includes("chats")){
        this.notificaciones.unshift(data);

        setTimeout(() => {
          this.notificaciones.length = this.notificaciones.length - 1;
        }, 5000);
      }
    });

    if(localStorage.getItem("token")){
      this.userService.cargarPerfil({ usuario: "me" });
      this.userService.getPerfil().subscribe(data =>{
        if(data){
          if(data.ok){
            this.socketService.unirseSala(data._id);
          }
        }
      });
    }

  }

  irChat(idChat: string){
    this.router.navigate(["chats/" + idChat]);
  }
}
