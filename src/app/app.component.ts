import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzDrawerComponent, NzDrawerPlacement, NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { filter, Observable } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LeafletDirective } from '@bluehalo/ngx-leaflet';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NzButtonModule,
    RouterModule,
    NzDescriptionsModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzAffixModule,
    NzDrawerComponent,
    NzDrawerModule,
    NzTypographyModule,
    NzTreeModule,
    CommonModule,
    NzDividerModule,
    NzIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  currentUrl: string = '';
  title = 'babbi-sul-web';
  visible = false;
  isAuthenticated: boolean = false;
  placement: NzDrawerPlacement = 'left';

  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.authService.selectAuth().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
    this.currentUrl = this.router.url
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        console.log(this.currentUrl); // opzionale per debug
      });
  }

  onBack(): void {
    console.log('onBack');
    this.location.back();
  }

  onNavigate(path: string) {
    this.closeDrawer();
    this.router.navigate([path]);
  }

  openDrawer(): void {
    this.visible = true;
  }

  closeDrawer(): void {
    this.visible = false;
  }

  readonly nodes = [
    {
      title: 'Pagine carine',
      key: '100',
      expanded: true,
      icon: 'smile',
      children: [
        { title: 'Photogallery', key: '1001', icon: 'meh', isLeaf: true },
        { title: 'About us', key: '1002', icon: 'frown', isLeaf: true },
      ],
    },
    {
      title: 'Giochi',
      key: '100',
      expanded: true,
      icon: 'smile',
      children: [
        { title: 'Quizzabba', key: '2001', icon: 'meh', isLeaf: true },
        { title: 'Trisbabbo', key: '2002', icon: 'frown', isLeaf: true },
      ],
    },
    {
      title: 'Listoni',
      key: '100',
      expanded: true,
      icon: 'smile',
      children: [
        { title: 'Filmetti da vedere', key: '3001', icon: 'meh', isLeaf: true },
        { title: 'Ricettine da fare', key: '3002', icon: 'frown', isLeaf: true },
      ],
    },
  ];
}
