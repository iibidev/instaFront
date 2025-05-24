import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-routing-btn',
  templateUrl: './routing-btn.component.html',
  styleUrls: ['./routing-btn.component.css']
})
export class RoutingBtnComponent implements OnInit{

  history: boolean = false;

  constructor(private location: Location, private router: Router){}

  ngOnInit(): void {
    if (window.history.length > 1) {
      this.history = true;
    } else {
      this.history = false;
    }
  }

  volverAtras() {
    if (this.history) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
  
}
