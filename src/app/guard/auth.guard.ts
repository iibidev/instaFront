import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard{

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
  
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
  
    if (isExpired) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return false;
    }
  
    return true;
  }
  
}
