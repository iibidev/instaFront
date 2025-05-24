import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  url: string = "http://localhost:3000/follow";
  constructor(private http: HttpClient) { }

  seguirUsuario(id_usuario: String): Observable<any>{
    return this.http.post(this.url + "/followSomeone", { id_usuario });
  }
}
