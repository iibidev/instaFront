import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { Perfil } from '../models/perfil.model';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent {

  @Input() posts!: Array<Post>;
  @Input() perfil!: Perfil;
  mostrarReel: boolean = false;
  mostrarPost: boolean = false;
  reelSeleccionado!: Post;
  postSeleccionado!: Post;


  verPost(post: Post){
    if(post.tipo == "post"){
      this.mostrarPost = true;
      this.postSeleccionado = post;
    }else{
      this.mostrarReel = true;
      this.reelSeleccionado = post;
    }
  }
}
