import { Component } from '@angular/core';
import { RutasService } from '../service/rutas.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { SocketService } from '../service/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = "";
  passwd: string = "";
  showPasswdBtnText: string = "Mostrar";
  showPasswdBtn: boolean = false;
  showPasswd: boolean = false;
  registerForm: FormGroup;
  showLoader: boolean = false;
  showError: boolean = false;
  errorMsg: String = "";

  constructor(private fb: FormBuilder, private mostrarHeader: RutasService,
    private userService: UserService, private router: Router, 
    private socketService: SocketService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [
        Validators.maxLength(13)
      ]],
      usuario: ['', [
        Validators.required,
        Validators.pattern('^(?!.*\\.\\.)(?!.*\\.$)[a-z0-9._]{1,13}$'),
        Validators.minLength(3),
        Validators.maxLength(13)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  ngOnInit(): void {
    this.mostrarHeader.setMostrarHeader(false);
  }

  showPassword(){
    this.showPasswd = !this.showPasswd;
    this.showPasswd ? this.showPasswdBtnText = "Ocultar" : this.showPasswdBtnText = "Mostrar";
  }

  checkFieldChars(){
    this.passwd.length > 0 ? this.showPasswdBtn = true : this.showPasswdBtn = false;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const datos = this.registerForm.value;
      this.showLoader = true;
      this.userService.registrarse(datos).subscribe({
        next: data =>{
          if(data.ok){
            localStorage.setItem('token', data.token);
            this.userService.cargarPerfil({ usuario: "me" });
            this.userService.getPerfil().subscribe(data =>{
              if(data){
                if(data.ok){
                  this.socketService.unirseSala(data._id);
                }
              }
            });
            this.router.navigate(["/perfil"]);
          }else{
            this.showLoader = false;
            this.showError = true;
            this.errorMsg = data.error;
          }          
        },
        error: err =>{
          console.log(err);          
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  iniciarSesion(){
    if(this.email.trim() == "" || this.passwd.trim() == ""){
      this.showError = true;
      this.errorMsg = "Se deben rellenar los campos.";
      this.email = this.email.trim();
    }else{
      this.showLoader = true;
      this.userService.login({ email: this.email.trim(), password: this.passwd }).subscribe({
        next: data =>{
          if(data.ok){
            localStorage.setItem('token', data.token);
            this.userService.cargarPerfil({ usuario: "me" });
            this.userService.getPerfil().subscribe(data =>{
              if(data){
                if(data.ok){
                  this.socketService.unirseSala(data._id);
                }
              }
            });
            this.router.navigate(["/"]);
          }else{
            this.showLoader = false;
            this.showError = true;
            this.errorMsg = data.error;
          }
        },
        error: error =>{
          console.log(error);
        }
      });
    }
  }
}
