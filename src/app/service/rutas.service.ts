import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  private mostrarHeader = new BehaviorSubject<boolean>(true);
  mostrarHeader$ = this.mostrarHeader.asObservable();

  setMostrarHeader(valor: boolean) {
    this.mostrarHeader.next(valor);
  }

  formatearFechaPost(fecha: string | Date): string {
    const fechaPost = new Date(fecha);
    const ahora = new Date();
    const diferenciaMs = ahora.getTime() - fechaPost.getTime();
  
    const segundos = Math.floor(diferenciaMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const semanas = Math.floor(dias / 7);
    const meses = Math.floor(dias / 30);
  
    if (segundos < 60) return `hace unos segundos`;
    if (minutos < 60) return `hace ${minutos} minuto${minutos === 1 ? '' : 's'}`;
    if (horas < 24) return `hace ${horas} hora${horas === 1 ? '' : 's'}`;
    if (dias < 7) return `hace ${dias} día${dias === 1 ? '' : 's'}`;
    if (semanas < 4) return `hace ${semanas} semana${semanas === 1 ? '' : 's'}`;
  
    // Si ha pasado más de un mes, devolver la fecha completa
    return fechaPost.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
}
