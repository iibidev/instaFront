import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import{ HttpClient } from '@angular/common/http';
import { Perfil } from '../models/perfil.model';
import { Router } from '@angular/router';
import { env } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = env.BACKURL;
  private perfilSubject = new BehaviorSubject<any>(null);
  private lastSearchesSubject = new BehaviorSubject<Array<any>>([]);

  constructor(private http: HttpClient, private router: Router) {
    const searches = localStorage.getItem("lastSearches");
    const resultado = searches ? JSON.parse(searches) : [];
    this.lastSearchesSubject.next(resultado);
  }

  cargarPerfil(usuario: Object): void {
    this.http.post<Perfil>(this.url + "/auth/userProfile", usuario)
      .subscribe({
        next: (data) => this.perfilSubject.next(data),
        error: (err) => console.error('Error cargando perfil', err)
      });
  }

  registrarse(datos: Object): Observable<any>{
    return this.http.post<any>(this.url + "/auth/register", datos);
  }

  login(datos: Object): Observable<any>{
    return this.http.post<any>(this.url + "/auth/login", datos);
  }

  userProfile(usuario: Object): Observable<any>{
    return this.http.post(this.url + "/auth/userProfile", usuario);
  }

  getPerfil(): Observable<any> {
    return this.perfilSubject.asObservable();
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.perfilSubject.next(null);
    this.router.navigate(["/login"]);
  }

  actualizarPerfil(datosPerfil: Object): Observable<any>{
    return this.http.put(this.url + "/auth/userProfile", datosPerfil);
  }

  actualizarFoto(foto: Object): Observable<any>{
    return this.http.put(this.url + "/auth/userProfile/profilePic", foto);
  }

  buscarPorUsuario(query: String): Observable<any>{
    return this.http.get(this.url + "/auth/user/search?q=" + query);
  }

  getLastSearches(): Observable<any>{
    return this.lastSearchesSubject.asObservable();
  }

  addSearch(user: any){
    const searches = this.lastSearchesSubject.getValue();
    
    //Elimina el usuario si existe en las últimas busquedas para que no se repita.
    for (let search of searches){
      if (search._id == user._id){
        const userIndex = searches.findIndex(el => el._id == user._id);
        searches.splice(userIndex, 1);
        break;
      }
    }

    if(searches.length >= 8){
      searches.length = 7;
    }

    searches.unshift(user);
    localStorage.setItem("lastSearches", JSON.stringify(searches));
    this.lastSearchesSubject.next(searches);
  }

  removeSearch(user: any){
    const searches = this.lastSearchesSubject.getValue();
    const userIndex = searches.findIndex(el => el._id == user._id); //Buscar índice del usuario en el array.
    searches.splice(userIndex, 1); //Eliminar posición del array.
    localStorage.setItem("lastSearches", JSON.stringify(searches));
    this.lastSearchesSubject.next(searches);
  }

  removeAll(){
    localStorage.removeItem("lastSearches");
    this.lastSearchesSubject.next([]);
  }

}
