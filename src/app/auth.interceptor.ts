import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isCloudinary = req.url.includes('cloudinary.com');

    if (isCloudinary) {
      return next.handle(req); // no añadir Authorization
    }
    
    // Recuperar el token del localStorage
    const token = localStorage.getItem('token');

    // Si hay token, clonamos la request y añadimos el Authorization
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
