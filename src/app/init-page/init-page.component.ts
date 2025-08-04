import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-init-page',
  imports: [],
  templateUrl: './init-page.component.html',
  styleUrl: './init-page.component.css',
})
export class InitPageComponent implements OnInit {
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.router.navigate(['/login'])
  }
}
