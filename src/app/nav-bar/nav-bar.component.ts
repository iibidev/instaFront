import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{

  usuario!: String;
  foto: any;
  panelbusquedaAbierto: boolean = false;
  panelCrearAbierto: boolean = false;

  constructor(private userService: UserService, private router: Router){}

  ngOnInit(): void {
    this.userService.getPerfil().subscribe(data =>{
      if(data){
        const { usuario, foto } = data;
        this.usuario = usuario;
        this.foto = foto;
      }
    });
  }

  abrirPanelBusqueda(){
    this.panelbusquedaAbierto = !this.panelbusquedaAbierto;
  }

  cerrarPanelBusqueda(){
    this.panelbusquedaAbierto = false;
  }

  abrirPanelCrear(){
    this.panelCrearAbierto = true;
  }

  cerrarPanelCrear(){
    this.panelCrearAbierto = false;
  }

  irACrear(tipo: String){
    this.cerrarPanelCrear();
    this.router.navigate(['crear/' + tipo]);
  }

}
