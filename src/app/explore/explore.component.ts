import { Component } from '@angular/core';
import { RutasService } from '../service/rutas.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PostService } from '../service/post.service';
import { Post } from '../models/post.model';
import { Perfil } from '../models/perfil.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent {

  posts: Array<Post> = [];
  perfil!: Perfil;
  postSeleccionado!: Post;
  mostrarReel: boolean = false;
  mostrarPost: boolean = false;

  constructor(private mostrarHeader: RutasService, private router: Router,
    private location: Location, private postService: PostService
  ){}

  ngOnInit(): void {
    this.mostrarHeader.setMostrarHeader(true);
    this.postService.explore$.subscribe(data =>{
      this.posts = data;
    });
  }

  irABuscar(){
    this.router.navigateByUrl(this.location.path() + "/buscar");
  }

  verPost(post: Post){
    this.postSeleccionado = post;
    this.perfil = this.postSeleccionado.perfil;

    if(this.postSeleccionado.tipo == "reel"){
      this.mostrarReel = true;
    }else{
      this.mostrarPost = true;
    }
  }

}
