import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RutasService } from '../service/rutas.service';
import { Perfil } from '../models/perfil.model';
import { UserService } from '../service/user.service';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.css']
})
export class UploadPageComponent implements OnInit{

  tipo!: String;
  posibles: Array<any> = ["post", "reel"];
  fotoElegida!: Blob;
  videoElegido!: Blob;
  fotoMostrar: String = "";
  videoMostrar: String = "";
  descripcion: String = "";
  textoModal: String = "";
  mostrarModal: boolean = false;
  mostrarVistaPrevia: boolean = false;
  mostrarLoader: boolean = false;

  perfil!: Perfil;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private rutasService: RutasService, private userService: UserService,
    private postService: PostService
  ){}

  ngOnInit(): void {

    this.rutasService.setMostrarHeader(false);

    this.activatedRoute.paramMap.subscribe(param =>{
      this.tipo = param.get("tipo") ? param.get("tipo") as String : "";
      if(!this.posibles.includes(this.tipo)){
        this.router.navigate([""]);
      }
    });

    this.userService.getPerfil().subscribe(data =>{
      this.perfil = data;
    });
  }

  elegirFoto(event: Event){
    const input = event.target as HTMLInputElement;
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    if(input.files && input.files.length > 0){
      const archivo = input.files[0];

      if(!archivo.type.startsWith("image/")){
        this.mostrarModal = true;
        this.textoModal = "Se debe elegir una imagen";
        return;
      }

      if(archivo.size > MAX_IMAGE_SIZE){
        this.mostrarModal = true;
        this.textoModal = "La imagen debe pesar menos de 5MB";
        return;
      }

      this.fotoElegida = archivo;
      const reader = new FileReader();
      reader.onload = ()=>{
        this.fotoMostrar = reader.result as String;
      }
      reader.readAsDataURL(archivo);
    }
  }

  elegirVideo(event: Event){
    const input = event.target as HTMLInputElement;
    const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

    if(input.files && input.files.length > 0){
      const video = input.files[0];
      
      if(!video.type.startsWith("video/")){
        this.mostrarModal = true;
        this.textoModal = "Se debe elegir un video";
        return;
      }

      if(video.size > MAX_VIDEO_SIZE){
        this.mostrarModal = true;
        this.textoModal = "El video debe pesar menos de 20MB";
        return;
      }
      
      this.videoElegido = video;
      const reader = new FileReader();
      reader.onload = ()=>{
        this.videoMostrar = reader.result as String;
      }
      reader.readAsDataURL(video);
    }
  }

  compartir(){

    if(this.descripcion.length > 100) return;

    if(this.fotoElegida || this.videoElegido){
      const formData = new FormData();
      formData.append("file", this.tipo == "post" ? this.fotoElegida : this.videoElegido);    
      formData.append('upload_preset', 'subida_directa');
      formData.append('folder', 'posts');

      this.mostrarLoader = true;
  
      this.postService.subirACloudinary(formData, this.tipo == "post" ? 'image' : 'video').subscribe({
        next: data =>{
          const urlArchivo = data.secure_url;

          this.postService.uploadPost(this.tipo, {
            post: urlArchivo,
            descripcion: this.descripcion.trim().replaceAll("\n", "\\n")
          }).subscribe({
            next: data =>{
              this.mostrarLoader = false;
              if(data.ok){
                this.mostrarModal = true;
                this.textoModal = this.tipo == "post" ? "Publicación creada" : "Reel subido";
                this.userService.cargarPerfil({ usuario: "me" });
                setTimeout(()=>{
                  this.router.navigate(['perfil/me']);
                }, 1900);
              }else{
                this.mostrarModal = true;
                this.textoModal = data.error;
              }
            },
            error: error =>{
              console.log(error);
              this.mostrarLoader = false;
              this.mostrarModal = true;
              this.textoModal = "Error en la petición para guardar";
            }
          });
        },
        error: error =>{
          console.log(error);
          this.mostrarLoader = false;
          this.mostrarModal = true;
          this.textoModal = "Error al guardar el archivo";
        }
      });
    }
  }

}
