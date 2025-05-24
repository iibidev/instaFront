import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements AfterViewInit {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  foto: string | null = null;
  stream!: MediaStream;
  permisos: boolean = true;
  modalBorrarFoto: boolean = false;
  frontCamera: boolean = true;
  nombreArchivo: String | null = null;
  fotoElegida: boolean = false;

  async ngAfterViewInit() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.frontCamera ? "user" : "environment" }
      });
      this.videoElement.nativeElement.srcObject = stream;
    } catch (error) {
      this.permisos = false;
    }
  }

  tomarFoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.foto = canvas.toDataURL("image/png"); // Guarda la imagen en base64
      this.nombreArchivo = null;
      this.fotoElegida = true;
    }
  }

  borrarFoto(){
    this.foto = null;
    this.modalBorrarFoto = false;
    this.fotoElegida = false;
    this.ngAfterViewInit();
  }

  elegirFoto(event: Event){
    const file = (event.target as HTMLInputElement).files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.foto = reader.result as string; // Convertimos la imagen a Base64
      };
      reader.readAsDataURL(file);
      this.nombreArchivo = file.name;
      this.fotoElegida = true;
    }    
  }

  ngOnDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop()); // Detenemos la cámara
    }
  }

}
