import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../service/chat.service';
import { Chat } from '../models/chat.model';
import { Perfil } from '../models/perfil.model';
import { Mensaje } from '../models/mensaje.model';
import { SocketService } from '../service/socket.service';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  chat!: Chat;
  miembro!: Perfil;
  mostrarLoader: boolean = true;
  mostrarModal: boolean = false;
  textoLoader: string = "Cargando chat...";
  textoModal: string = "";
  mensaje: String = "";
  mediaRecorder!: MediaRecorder;
  audioChunks: Array<any> = [];
  grabandoAudio: boolean = false;
  audio!: Blob;
  tiempoAudio: string = "00:00";
  borrarAudio: boolean = false;
  intervalId: any;
  mostrarEscribiendo: boolean = false;
  mostrarDibujo: boolean = false;
  verFotoChat: boolean = false;
  fotoElegida!: string;
  
  mostrarPost: boolean = false;
  mostrarReel: boolean = false;
  reelElegido!: Post;
  postElegido!: Post;
  mensajes: Array<Mensaje> = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private chatService: ChatService, private socketService: SocketService
  ){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      const idChat = params.get("id") || "";
      this.chatService.recogerUnChat(idChat).subscribe({
        next: data =>{
          if(data.ok){
            this.chat = data.chat;
            this.miembro = this.chat.miembros[1];
            this.textoLoader = "Cargando mensajes...";

            this.socketService.escribiendo(this.chat._id).subscribe(data =>{
              this.mostrarEscribiendo = data;
            });

            this.socketService.noEscribiendo(this.chat._id).subscribe(data =>{
              this.mostrarEscribiendo = data;
            });

            //Cargar mensajes
            this.chatService.cargarMensajes(this.chat._id).subscribe({
              next: data =>{
                if(data.ok){
                  this.mensajes = data.mensajes;
                  this.mostrarLoader = false;
                  this.scrollAutomatico(2);
                }else{
                  this.mostrarLoader = false;
                  this.mostrarModal = true;
                  this.textoModal = data.error;
                }
              },
              error: error =>{
                console.log(error);
                this.mostrarLoader = false;
                this.mostrarModal = true;
                this.textoModal = "Error en la petición";
              }
            });
          }else{
            this.mostrarLoader = false;
            this.mostrarModal = true;
            this.textoModal = data.error;
          }
        },
        error: error =>{
          console.log(error);
          this.mostrarLoader = false;
          this.mostrarModal = true;
          this.textoModal = "Error en la petición";
        }
      });
    });

    this.socketService.mensajeEntrante().subscribe(data =>{
      if(data.id_chat == this.chat._id){
        this.mensajes.push(data);
        this.scrollAutomatico(1);
      }
    });

    this.socketService.errorMessage().subscribe(data =>{
      console.log("Error al mandar mensaje");
    });

  }

  escribiendoMensaje(){
    this.socketService.inputEscribiendo(this.chat._id, this.miembro._id);
  }

  scrollAutomatico(modo: number){
    //1: scroll suave ||| 2: scroll seguido
    setTimeout(() => {
      const panelMensajes = document.querySelector('.mensajes');
      if (panelMensajes) {
        if(modo == 1){
          if(!panelMensajes?.classList.contains("scrollSuave")){
            panelMensajes.classList.add("scrollSuave");
          }
        }
        panelMensajes.scrollTop = panelMensajes.scrollHeight;
      }
    }, 0);
  }

  mandarTexto(){
    this.mensaje = this.mensaje.trim();
    if(this.mensaje.length > 0){
      this.socketService.sendText(this.mensaje, this.chat._id, this.miembro._id);
      this.mensaje = "";
    }
  }

  iniciarGrabacion() {
    if (this.grabandoAudio) return;
    this.iniciarContador();
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();
      this.grabandoAudio = true;

      this.mediaRecorder.ondataavailable = e => {
        this.audioChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        if(!this.borrarAudio){
          const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.audio = blob;
          this.mandarAudio();
        }
        this.borrarAudio = false;
        this.audioChunks = [];
      };

      setTimeout(() => {
        if (this.grabandoAudio) {
          this.detenerGrabacion();
        }
      }, 30000);

    }).catch(err => {
      console.error('Error accediendo al micrófono:', err);
    });
  }

  detenerGrabacion() {
    if (this.mediaRecorder && this.grabandoAudio) {
      this.pararContador();
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.grabandoAudio = false;
    }
  }

  mandarAudio(){
    const formData = new FormData();
    formData.append("file", this.audio);    
    formData.append('upload_preset', 'subir_audio');
    this.chatService.subirACloudinary(formData, "video").subscribe({
      next: data=>{
        const { secure_url, duration } = data;
        this.socketService.sendAudio(secure_url, duration, this.chat._id, this.miembro._id);
      },
      error: error =>{
        console.log(error);
      }
    });
  }

  mandarFoto(evt: Event){
    const input = evt.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const foto = input.files[0];

      const formData = new FormData();
      formData.append('file', foto);
      formData.append('upload_preset', 'subir_foto_chat');

      this.chatService.subirACloudinary(formData, 'image').subscribe({
        next: data => {
          this.socketService.sendPhoto(data.secure_url, this.chat._id, this.miembro._id);
        },
        error: error => {
          console.error('Error al subir foto', error);
        }
      });
    }
  }

  errorAlCargar(){
    this.mostrarModal = false;
    this.irChats();
  }

  verReel(reel: Post){
    this.reelElegido = reel;
    this.mostrarReel = true;
  }

  verpost(post: Post){
    this.postElegido = post;
    this.mostrarPost = true;
  }

  irChats(){
    this.router.navigate(["chats"]);
  }

  irPerfil(usuario: String){
    this.router.navigate(["perfil/" + usuario]);
  }

  irPerfilMiembro(){
    this.router.navigate(["perfil/" + this.miembro.usuario]);
  }

  iniciarContador() {
    this.tiempoAudio = "00:00"; // resetea si es necesario
    let segundos = 0;
    this.intervalId = setInterval(() => {
      this.tiempoAudio = this.formatearDuracion(segundos++);
      // console.log(this.duracion); // si quieres ver cómo sube
    }, 1000);
  }

  pararContador() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.tiempoAudio = "00:00";
    }
  }

  verFoto(foto: string){
    this.fotoElegida = foto;
    this.verFotoChat = true;
  }

  formatearDuracion(segundos: number): string {
    const minutos = Math.floor(segundos / 60).toString().padStart(2, '0');
    const segundosRestantes = (segundos % 60).toString().padStart(2, '0');
    return `${minutos}:${segundosRestantes}`;
  }


}
