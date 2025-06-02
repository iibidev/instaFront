import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../models/post.model';
import { Perfil } from '../models/perfil.model';
import { RutasService } from '../service/rutas.service';
import { PostService } from '../service/post.service';
import { Comentario } from '../models/comentario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  @Input() post!: Post;
  @Output() cerrar = new EventEmitter();
  fechaPost!: String;
  comentario: String = "";
  comentarios!: Array<Comentario>;
  publicando: boolean = false;
  verComentarios: boolean = false;
  mostrarPanelCompartir: boolean = false;

  constructor(private rutasService: RutasService, private postService: PostService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.fechaPost = this.rutasService.formatearFechaPost(this.post.fecha);
    //Cargar comentarios seguido de cargar el componente si el viewport es mayor a 800px
    if(window.document.body.getBoundingClientRect().width > 800){
      this.postService.getComments(this.post._id).subscribe({
        next: data =>{
          if(data.ok){
            this.comentarios = data.comentarios;            
          }else{
            console.log(data.error);
          }
        },
        error: error =>{
          console.log("Error en la petición");
        }
      });
    }
  }

  cerrarPost(){
    this.cerrar.emit();
  }

  lastClickTime: number = 0;

  //Dar like clickando dos veces seguidas.
  dobleClick() {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastClickTime;
  
    if (timeDiff < 300) {
      this.like();
      this.lastClickTime = 0;
    } else {
      this.lastClickTime = currentTime;
    }
  }
  
  like(){
    this.post.likeado = !this.post.likeado;

    this.postService.likePost(this.post._id).subscribe({
      next: data =>{
        if(!data.ok){
          this.post.likeado = !this.post.likeado;
        }
      },
      error: error =>{
        console.log(error);
        this.post.likeado = !this.post.likeado;
      }
    });
    
    this.post.likeado ? this.post.likes++ : this.post.likes--;
  }

  comentar(){
    this.publicando = true;
    this.postService.commentPost(this.post._id, this.comentario.trim()).subscribe({
      next: data =>{
        if(data.ok){
          this.comentario = "";
          this.publicando = false;
          this.comentarios.unshift(data.comentario);
          this.post.comentarios++;
        }else{
          this.publicando = false;
        }
      },
      error: error =>{
        this.publicando = false;
      }
    });
  }

  irAlPerfil(usuario: String){
    this.cerrar.emit();
    this.router.navigate(['perfil/' + usuario]);
  }

  formatearFecha(fecha: string){
    return this.rutasService.formatearFechaPost(fecha);
  }
}
