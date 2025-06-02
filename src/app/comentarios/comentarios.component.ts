import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostService } from '../service/post.service';
import { Comentario } from '../models/comentario.model';
import { Router } from '@angular/router';
import { RutasService } from '../service/rutas.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit{

  @Input() idPost!: String;
  @Output() cerrar = new EventEmitter();
  @Output() irPerfil = new EventEmitter();
  @Output() sumarComentario = new EventEmitter();
  comentarios: Array<Comentario> = [];
  publicando: boolean = false;
  comentario: String = "";

  constructor(private postService: PostService, private router: Router,
    private rutasService: RutasService
  ){}

  ngOnInit(): void {
    this.postService.getComments(this.idPost).subscribe({
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

  comentar(){
    this.publicando = true;
    this.postService.commentPost(this.idPost, this.comentario.trim()).subscribe({
      next: data =>{
        if(data.ok){
          this.comentario = "";
          this.publicando = false;
          this.comentarios.unshift(data.comentario);
          this.sumarComentario.emit();
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
    this.irPerfil.emit();
    this.router.navigate(['perfil/' + usuario]);
  }

  formatearFecha(fecha: string){
    return this.rutasService.formatearFechaPost(fecha);
  }

  cerrarComentarios(panel: HTMLElement){
    panel.classList.add("cerrarComentarios");
    setTimeout(()=>{
      this.cerrar.emit();
    }, 390);
  }

  cerrarPanel(evt: TouchEvent, panel: HTMLElement){
    const inicioY = evt.changedTouches[0].clientY;
    panel.addEventListener("touchend", (event) =>{
      const diff = event.changedTouches[0].clientY - inicioY;
      if(diff > 150){
        this.cerrarComentarios(panel);
      }
    });
  }
}
