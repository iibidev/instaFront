import { Component } from '@angular/core';
import { RutasService } from '../service/rutas.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent {
  constructor(private mostrarHeader: RutasService, private router: Router,
    private location: Location
  ){}

  ngOnInit(): void {
    this.mostrarHeader.setMostrarHeader(true);
  }

  irABuscar(){
    this.router.navigateByUrl(this.location.path() + "/buscar");
  }

}
