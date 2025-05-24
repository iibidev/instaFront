import { Component } from '@angular/core';
import { RutasService } from '../service/rutas.service';

@Component({
  selector: 'app-reels',
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.css']
})
export class ReelsComponent {
  constructor(private mostrarHeader: RutasService){}

  ngOnInit(): void {
    this.mostrarHeader.setMostrarHeader(true);
  }
}
