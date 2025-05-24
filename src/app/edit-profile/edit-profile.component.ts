import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Perfil } from '../models/perfil.model';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit{

  @Input() perfil!: Perfil;
  @Output() cerrarEditar = new EventEmitter;

  nombreApartado: String = "Editar perfil";
  imagenElegida: File | String = ""; //Imagen que se mandará para actualizar.
  cargandoImagen: boolean = false;
  textoModal: String = "";
  mostrarModal: boolean = false;
  modalEditarFoto: boolean = false;
  mostrarEditarCampos: boolean = false;
  campoEditar!: Number;
  msgErrorCampos: String = "";

  //variables para los campos que se pueden modificar.
  nombreNuevo: String = "";
  usuarioNuevo: String = "";
  descripcionNueva: String = "";

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.imagenElegida = this.perfil.foto;
    this.nombreNuevo = this.perfil.nombre;
    this.usuarioNuevo = this.perfil.usuario;
    this.descripcionNueva = this.perfil.descripcion.replaceAll("<br>", "\n");
  }

  cerrar(){
    this.cerrarEditar.emit();
  }

  elegirFoto(event: Event){
    const input = event.target as HTMLInputElement;

    if(input.files && input.files.length > 0){
      const file = input.files[0];
      this.cargandoImagen = true;
      this.modalEditarFoto = false;

      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        this.userService.actualizarFoto({ profilePic: base64Image }).subscribe({
          next: data =>{
            if(data.ok){
              this.imagenElegida = data.foto;
              this.cargandoImagen = false;
              this.textoModal = "Foto actualizada";
              this.mostrarModal = true;
              this.userService.cargarPerfil({ usuario: "me" })
            }
          },
          error: error =>{
            console.log(error);
            this.cargandoImagen = false;
          }
        });
      };
      reader.readAsDataURL(file);
    }

  }

  borrarFoto(){
    this.cargandoImagen = true;
    this.modalEditarFoto = false;

    this.userService.actualizarFoto({ profilePic: "" }).subscribe({
      next: data =>{
        this.cargandoImagen = false;
        if(data.ok){
          this.mostrarModal = true;
          this.textoModal = data.message;
          this.imagenElegida = "";
          this.userService.cargarPerfil({ usuario: "me" });
        }else{
          this.mostrarModal = true;
          this.textoModal = data.error;
        }
      },
      error: error =>{
        console.log(error);
      }
    });
  }

  //Mostrar panel para editar el campo elegido, por eso pasamos un número para saber el campo.
  editarCampo(campo: Number){
    this.mostrarEditarCampos = true;
    this.campoEditar = campo;

    switch(this.campoEditar){
      case 1:
        this.nombreApartado = "Nombre";
        break;
      case 2:
        this.nombreApartado = "Nombre de usuario";
        break;
      case 3:
        this.nombreApartado = "Descripción";
        break;
    }
  }

  autoResize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto'; // Reinicia la altura
    textarea.style.height = textarea.scrollHeight + 'px'; // Ajusta a contenido
  }

  cerrarEditarCampos(){
    this.mostrarEditarCampos = false;
    this.nombreApartado = 'Editar perfil';
    this.nombreNuevo = this.perfil.nombre;
    this.usuarioNuevo = this.perfil.usuario;
    this.descripcionNueva = this.perfil.descripcion.replaceAll("<br>", "\n");
    this.msgErrorCampos = "";
  }

  comprobarCampos(): boolean{
    this.nombreNuevo = this.nombreNuevo.trim();
    this.usuarioNuevo = this.usuarioNuevo.trim();
    this.descripcionNueva = this.descripcionNueva.trim();

    if(this.nombreNuevo.length > 13){
      this.msgErrorCampos = "Máximo 13 caracteres.";
      return false;
    }

    if(this.usuarioNuevo.length < 3 
      || this.usuarioNuevo.length > 13){
      this.msgErrorCampos = "Mínimo 3 y máximo 13 caracteres.";
      return false;
    }

    if(!this.usuarioNuevo.match(/^(?!.*\\.\\.)(?!.*\\.$)[a-z0-9._]{1,13}$/)){
      this.msgErrorCampos = "Solo minúsculas, números, punto y guión bajo.";
      return false;
    }

    if(this.descripcionNueva.length > 150){
      return false;
    }

    return true;
  }

  actualizar(){
    if(this.comprobarCampos()){
      this.userService.actualizarPerfil({
        usuario: this.usuarioNuevo,
        nombre: this.nombreNuevo,
        descripcion: this.descripcionNueva.replaceAll("\n", "\\n")
      }).subscribe({
        next: data =>{
          if(data.ok){
            this.mostrarModal = true;
            this.textoModal = "Perfil actualizado";
            this.userService.cargarPerfil({ usuario: "me" });
          }else{
            this.mostrarModal = true;
            this.textoModal = data.error;
          }
        },
        error: error =>{
          this.mostrarModal = true;
          this.textoModal = "Error al actualizar.";
        }
      });
    }
  }
}
