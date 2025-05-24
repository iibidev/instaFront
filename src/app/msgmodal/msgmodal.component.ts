import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-msgmodal',
  templateUrl: './msgmodal.component.html',
  styleUrls: ['./msgmodal.component.css']
})
export class MsgmodalComponent implements OnInit{

  @Input() texto!: String;
  @Input() duracion!: number;
  @Output() cerrarModal = new EventEmitter();

  ngOnInit(): void {
    setTimeout(()=>{
      this.cerrarModal.emit(); //Al acabar el tiempo, emitimos para cerrar el modal desde otro componente.
    }, this.duracion);
  }
}
