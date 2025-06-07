import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-verfotochat',
  templateUrl: './verfotochat.component.html',
  styleUrls: ['./verfotochat.component.css']
})
export class VerfotochatComponent {

  @Input() foto!: string;
  @Output() cerrar = new EventEmitter();


  async descargar(){
    try {
      const response = await fetch(this.foto);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'foto_guardada_insta.png';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url); // Limpia la memoria
    } catch (err) {
      console.error("Error al descargar la imagen:", err);
    }
  }

  cerrarFoto(){
    this.cerrar.emit();
  }
}
