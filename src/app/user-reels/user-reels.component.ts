import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { Perfil } from '../models/perfil.model';

@Component({
  selector: 'app-user-reels',
  templateUrl: './user-reels.component.html',
  styleUrls: ['./user-reels.component.css']
})
export class UserReelsComponent implements OnInit{

  @Input() reels!: Array<Post>;
  @Input() perfil!: Perfil;
  reelSeleccionado!: Post;

  mostrarReel: boolean = false;

  ngOnInit(): void {
    this.reels = this.reels.filter(post => post.tipo == "reel");
  }

  verReel(reel: Post){
    this.reelSeleccionado = reel;
    this.mostrarReel = true;
  }

}
