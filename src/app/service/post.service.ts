import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  url: String = "http://localhost:3000/post/";

  constructor(private http: HttpClient) { }

  subirACloudinary(formData: FormData, tipo: String): Observable<any>{
    return this.http.post(`https://api.cloudinary.com/v1_1/dzwufjd9o/${tipo}/upload`, formData);
  }

  uploadPost(tipo: String, post: Object): Observable<any>{
    return this.http.post(this.url + "upload/" + tipo, post);
  }

  likePost(idPost: String): Observable<any>{
    return this.http.post(this.url + "like", { postId: idPost });
  }

  commentPost(idPost: String, comentario: String): Observable<any>{
    return this.http.post(this.url + "comment", { postId: idPost, comment: comentario });
  }

}
