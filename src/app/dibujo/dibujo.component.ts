import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Chat } from '../models/chat.model';
import { SocketService } from '../service/socket.service';
import { ChatService } from '../service/chat.service';

@Component({
  selector: 'app-dibujo',
  templateUrl: './dibujo.component.html',
  styleUrls: ['./dibujo.component.css']
})
export class DibujoComponent implements AfterViewInit{

  @Output() cerrar = new EventEmitter();
  @Input() chat!: Chat;
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('colorPicker') colorInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('colorBtn') colorBtnRef!: ElementRef<HTMLElement>;
  context: any;
  loader: boolean = false;

  constructor(private socketService: SocketService, private chatService: ChatService){}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext("2d");
    this.context = ctx;
    const colorBtn = this.colorBtnRef.nativeElement;
    const colorinput = this.colorInputRef.nativeElement;
    colorBtn.style.backgroundColor = colorinput.value;
    const tools = document.querySelectorAll(".tools__option");
    const deshacer = document.getElementById("deshacer");
    const rehacer = document.getElementById("rehacer");
    const grosorInput: any = document.getElementById("grosorInput");

    tools.forEach(tool => tool.addEventListener("click", ()=>{
      setModo(tool.id);
    }));

    let startX, startY;
    let lastX = 0, lastY = 0;
    let drawing = false;
    let imageDataArray: any = [];
    let imagePosition: number;
    let modo = "draw";
    const MODO = {
      DRAW: "draw",
      ERASE: "erase"
    };

    if(ctx){
      ctx.lineWidth = 3;               // Grosor de línea
      ctx.lineJoin = 'round';          // Uniones redondeadas
      ctx.lineCap = 'round';           // Puntas redondeadas

      canvas.addEventListener("mousedown", empezarDibujo);
      canvas.addEventListener("mousemove", dibujar);
      canvas.addEventListener("mouseup", dejarDibujar);
      canvas.addEventListener("mouseleave", dejarDibujar);
      // 🟢 Soporte para móviles:
      canvas.addEventListener("touchstart", empezarDibujo);
      canvas.addEventListener("touchmove", dibujar);
      canvas.addEventListener("touchend", dejarDibujar);
      canvas.addEventListener("touchcancel", dejarDibujar);
      colorinput.addEventListener("change", ()=>{
        colorBtn.style.backgroundColor = colorinput.value;
        ctx.strokeStyle = colorinput.value;
      });
      deshacer?.addEventListener("click", ()=>{
        if (imagePosition > 0) {
          imagePosition -= 1;
          ctx.putImageData(imageDataArray[imagePosition], 0, 0);
        }
      });
      rehacer?.addEventListener("click", ()=>{
        if (imagePosition < imageDataArray.length - 1) {
          imagePosition += 1;
          ctx.putImageData(imageDataArray[imagePosition], 0, 0);
        }
      });
      grosorInput?.addEventListener("change", ()=>{
        ctx.lineWidth = grosorInput.value;
      });
    }

    function getCoords(evt: any, canvas: HTMLCanvasElement) {
      const rect = canvas.getBoundingClientRect();

      if (evt.touches && evt.touches.length > 0) {
        return {
          x: evt.touches[0].clientX - rect.left,
          y: evt.touches[0].clientY - rect.top
        };
      } else {
        return {
          x: evt.offsetX,
          y: evt.offsetY
        };
      }
    }

    function empezarDibujo(evt: any) {
      evt.preventDefault(); // Importante para evitar scroll en móvil
      drawing = true;

      const { x, y } = getCoords(evt, canvas);

      startX = x;
      startY = y;
      lastX = x;
      lastY = y;

      imageDataArray.push(ctx?.getImageData(0, 0, canvas.width, canvas.height));
      imagePosition = imageDataArray.length - 1;
    }

    function dibujar(evt: any) {
      if (!drawing) return;

      evt.preventDefault();

      const { x, y } = getCoords(evt, canvas);

      if (modo == MODO.DRAW || modo == MODO.ERASE) {
        ctx?.beginPath();
        ctx?.moveTo(lastX, lastY);
        ctx?.lineTo(x, y);
        ctx?.stroke();
        lastX = x;
        lastY = y;
        return;
      }
    }


    function dejarDibujar(){
      drawing = false;
    }

    function setModo(mod: string){
      modo = mod;

      tools.forEach(tool =>{
        tool.classList.remove("tools__option--elegido");
        if(tool.id == modo){
          tool.classList.add("tools__option--elegido");
        }
      });

      if(modo == MODO.DRAW){
        ctx ? ctx.globalCompositeOperation = 'source-over' : null;
      }

      if(modo == MODO.ERASE){
        ctx ? ctx.globalCompositeOperation = 'destination-out' : null;
      }
    }


  }

  mandarDibujo(){
    this.loader = true;
    this.context.globalCompositeOperation = "destination-over";
    this.context.fillStyle = "#fff";
    this.context.fillRect(0, 0, this.canvasRef.nativeElement.width, 
      this.canvasRef.nativeElement.height);
    const fotoDibujo = this.canvasRef.nativeElement.toDataURL("image/png");
    const formData = new FormData();
    formData.append('file', fotoDibujo);
    formData.append('upload_preset', 'subir_foto_chat');

    this.chatService.subirACloudinary(formData, 'image').subscribe({
      next: data => {
        this.socketService.sendPaint(data.secure_url, this.chat._id, this.chat.miembros[1]._id);
        this.loader = false;
        this.cerrarDibujo();
      },
      error: error => {
        console.error('Error al subir foto', error);
      }
    });
  }

  cerrarDibujo(){
    this.containerRef.nativeElement.classList.add("slideDown");
    setTimeout(()=>{
      this.cerrar.emit();
    }, 290);
  }
}
