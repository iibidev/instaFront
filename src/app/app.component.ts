import { ChangeDetectorRef, Component } from '@angular/core';
import { SocketService } from './service/socket.service';
import { RutasService } from './service/rutas.service';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navBar: boolean = false;

  constructor(private socketService: SocketService, 
    private mostrarHeader: RutasService, 
    private cdRef: ChangeDetectorRef,
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.mostrarHeader.mostrarHeader$.subscribe(data =>{
      this.navBar = data;
      this.cdRef.detectChanges();
    });

    this.userService.cargarPerfil({ usuario: "me" });
  }
}
