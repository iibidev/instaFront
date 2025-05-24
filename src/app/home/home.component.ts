import { Component } from '@angular/core';
import { RutasService } from '../service/rutas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private mostrarHeader: RutasService){}

  ngOnInit(): void {
    this.mostrarHeader.setMostrarHeader(true);
  }
}
