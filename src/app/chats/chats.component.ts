import { Component, OnInit } from '@angular/core';
import { RutasService } from '../service/rutas.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit{

  constructor(private mostrarHeader: RutasService){}

  ngOnInit(): void {
    this.mostrarHeader.setMostrarHeader(false);
  }
}
