import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UserService } from '../service/user.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit{

  queryBusqueda: String = "";
  resultados: Array<any> = [];
  @Output() cerrar = new EventEmitter<boolean>();
  busquedas: Array<any> = [];
  is_exploring: boolean = false;

  constructor(private userService: UserService, private location: Location,
    private router: Router
  ){}

  ngOnInit(): void {
    this.userService.getLastSearches().subscribe(data =>{
      this.busquedas = data;
    });
    //Ver la ruta en la que estamos para cambiar la funcionalidad del boton cancelar.
    if(this.location.path() === "/explorar/buscar"){
      this.is_exploring = true;
    }
  }

  buscar(){
    if(this.queryBusqueda.trim() != ""){
      this.userService.buscarPorUsuario(this.queryBusqueda).subscribe({
        next: data =>{
          if(data.ok){
            this.resultados = data.usuarios;
          }
        },
        error: error =>{
          console.log(error)
        }
      });
    }else{
      this.resultados = [];
    }
  }

  cerrarPanel(){
    if(this.is_exploring){
      this.router.navigate(["/explorar"]);
    }else{
      this.cerrar.emit(false);
    }
  }

  buscado(usuario: any){
    this.userService.addSearch(usuario);
    this.cerrar.emit(false);
  }

  eliminar(usuario: any){
    this.userService.removeSearch(usuario);
  }

  borrarTodo(){
    this.userService.removeAll();
  }

  //Para que se enfoque el input y se pueda escribir seguido.
  focus(el: HTMLInputElement){
    el.focus();
  }
}
