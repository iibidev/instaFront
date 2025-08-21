import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { env } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  url: String = env.BACKURL + "/post/";

  exploreSubject = new BehaviorSubject<Array<Post>>([]);
  homeSubject = new BehaviorSubject<Array<Post>>([]);
  explore$ = this.exploreSubject.asObservable();
  home$ = this.homeSubject.asObservable();

  constructor(private http: HttpClient) {
    this.explore().subscribe({
      next: data =>{
        if(data.ok){
          this.exploreSubject.next(data.posts);
        }else{
          console.log(data.error);
        }
      },
      error: error =>{
        console.log(error);
      }
    });

    this.homePosts().subscribe({
      next: data =>{
        if(data.ok){
          this.homeSubject.next(data.posts);
        }else{
          console.log(data.error);
        }
      },
      error: error =>{
        console.log(error);
      }
    });
  }

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

  getComments(idPost: String): Observable<any>{
    return this.http.get(this.url + "comments/" + idPost);
  }

  private explore(): Observable<any>{
    return this.http.get(this.url + "allPosts/explore");
  }

  private homePosts(): Observable<any>{
    return this.http.get(this.url + "allPosts/home");
  }

}
