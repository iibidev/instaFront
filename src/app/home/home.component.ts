import { ChangeDetectorRef, Component } from '@angular/core';
import { RutasService } from '../service/rutas.service';
import { PostService } from '../service/post.service';
import { Post } from '../models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  posts: Array<Post> = [];
  idPostVerComentarios!: string;
  mostrarComentarios: boolean = false;
  mostrarReel: boolean = false;
  mostrarCompartir: boolean = false;
  reelSeleccionado!: Post;
  postElegido!: Post;

  constructor(private rutasService: RutasService, private postService: PostService,
    private router: Router, private cd: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.rutasService.setMostrarHeader(true);

    this.postService.home$.subscribe(data => {
      this.posts = data;

      // Forzamos la detección de cambios para que el DOM se actualice
      this.cd.detectChanges();

      // Esperamos al siguiente ciclo del event loop para asegurar que el DOM ya se actualizó
      setTimeout(() => {
        const videos = document.querySelectorAll('.reel__video');

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const video = entry.target as HTMLVideoElement;

            if (entry.isIntersecting) {
              video.play();
            } else {
              video.pause();
            }
          });
        }, {
          threshold: 0.5
        });

        videos.forEach(video => observer.observe(video));
      }, 0);
    });
  }

  irAlPerfil(usuario: String){
    this.router.navigate(['perfil/' + usuario]);
  }

  lastClickTime: number = 0;

  dobleClick(post: Post) {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastClickTime;
  
    if (timeDiff < 300) {
      this.like(post);
      this.lastClickTime = 0;
    } else {
      this.lastClickTime = currentTime;
    }
  }

  like(post: Post){
    post.likeado = !post.likeado;

    this.postService.likePost(post._id).subscribe({
      next: data =>{
        if(!data.ok){
          post.likeado = !post.likeado;
        }
      },
      error: error =>{
        console.log(error);
        post.likeado = !post.likeado;
      }
    });
    
    post.likeado ? post.likes++ : post.likes--;
  }

  verComentarios(post: Post){
    this.idPostVerComentarios = post._id;
    this.mostrarComentarios = true;
  }

  compartir(post: Post){
    this.postElegido = post;
    this.mostrarCompartir = true;
  }

  fechaFormateada(fecha: string){
    return this.rutasService.formatearFechaPost(fecha);
  }
}
