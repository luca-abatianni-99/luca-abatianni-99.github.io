import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NgForOf, CommonModule } from '@angular/common';
import { inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { NzModalRef, NzModalService, NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';

import { NzDrawerModule, NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    NzTypographyModule,
    NzFlexModule,
    NzIconModule,
    NzDrawerModule,
    NzButtonModule,
    NzLayoutModule,
    NzMenuModule,
    NzSplitterModule,
    NzFloatButtonModule,
    NzModalModule,
    CommonModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        animate('2000ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeInDelayed', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(0px)' }),
        animate(
          '{{delay}}ms {{duration}}ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
    ]),
  ],
})
export class HomePageComponent implements OnInit, AfterViewInit {

  isCollapsed = true;

  constructor(
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('onInit');
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }

  onNavigate(path: string) {
    this.router.navigate([path]);
  }

  scrollDown() {
    window.scrollBy({
      top: window.innerHeight, // 100vh
      left: 0,
      behavior: 'smooth',
    });
  }

  openPartyModalsAndCloseAll(): void {
    const count = 5;
    const delay = 2000; // 1 secondo tra una modale e l'altra
    const leftStep = 300;
    const topStep = 100;
    const screenWidth = window.innerWidth;

    let modalsOpened = 0;
    let left = 0;
    let top = 70;

    const content = [
      'AUGURI AMOREEEEEEE!!!',
      '+ 4 MADOOOOOOO',
      'YEEEEEEEEEEEEEE',
      "N'imu fatti ecchi",
      "PERO' YEEEEEEEEEEEE",
    ];

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        // Se sfora lo schermo, resetta left a 0
        if (left + leftStep > screenWidth) {
          left = 0;
        }
        if (i != 0) {
          top += topStep; // facoltativo: puoi anche lasciare top invariato
        }

        this.modal.success({
          nzMask: false,
          nzTitle: content[i],
          nzContent: content[i],
          nzStyle: {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
          },
          nzClosable: true,
          nzOkText: null,
        });

        left += leftStep;
        modalsOpened++;
      }, i * delay);
    }

    // Chiudi tutte le modali 3 secondi dopo l’ultima apertura
    setTimeout(
      () => {
        this.modal.closeAll();
      },
      count * delay + 3000,
    );

    this.modal.afterAllClose.subscribe(() => {
      console.log('afterAllClose emitted!');
    });
  }
}
