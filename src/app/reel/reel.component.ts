import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../models/post.model';
import { Perfil } from '../models/perfil.model';
import { Router } from '@angular/router';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-reel',
  templateUrl: './reel.component.html',
  styleUrls: ['./reel.component.css']
})
export class ReelComponent {

  @Input() reel!: Post;
  @Output() cerrar = new EventEmitter();
  verComentarios: boolean = false;
  mostrarCompartir: boolean = false;

  constructor(private router: Router, private postService: PostService){}

  cerrarReel(){
    this.cerrar.emit();
  }

  irAlPerfil(){
    if(!this.router.url.includes("perfil")){
      this.router.navigate(['perfil/' + this.reel.perfil.usuario]);
    }
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
    this.reel.likeado = !this.reel.likeado;

    this.postService.likePost(this.reel._id).subscribe({
      next: data =>{
        if(!data.ok){
          this.reel.likeado = !this.reel.likeado;
        }
      },
      error: error =>{
        console.log(error);
        this.reel.likeado = !this.reel.likeado;
      }
    });
    
    this.reel.likeado ? this.reel.likes++ : this.reel.likes--;
  }
}
