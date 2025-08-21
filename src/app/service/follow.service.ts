import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  url: string = env.BACKURL + "/follow";
  constructor(private http: HttpClient) { }

  seguirUsuario(id_usuario: String): Observable<any>{
    return this.http.post(this.url + "/followSomeone", { id_usuario });
  }
}
