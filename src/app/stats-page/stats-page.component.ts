import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { interval, Subscription } from 'rxjs';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  intervalToDuration,
} from 'date-fns';

@Component({
  selector: 'app-stats-page',
  imports: [
    CommonModule,
    NzTypographyComponent,
    NzFlexModule,
    NzCardModule,
    NzTabsModule,
    NzFloatButtonModule,
    NzIconModule,
    NzModalModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule,
    NzSkeletonModule,
    NzEmptyModule,
    NzDividerModule,
  ],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.css',
})
export class StatsPageComponent implements OnInit, OnDestroy {
  private referenceDate = new Date('2021-08-11T05:00:00'); // data di riferimento
  isModalVisible: boolean = false;

  anniMesiGiorni: Duration = {};
  giorni = 0;
  ore = 0;
  minuti = 0;
  secondi = 0;

  private sub!: Subscription;

  ngOnInit(): void {
    this.sub = interval(1000).subscribe(() => {
      const now = new Date();

      // Anni, mesi, giorni
      const duration = intervalToDuration({ start: this.referenceDate, end: now });
      this.anniMesiGiorni = duration;

      // Giorni totali
      this.giorni = differenceInDays(now, this.referenceDate);

      // Ore totali
      this.ore = differenceInHours(now, this.referenceDate);

      // Minuti totali
      this.minuti = differenceInMinutes(now, this.referenceDate);

      // Secondi totali
      this.secondi = differenceInSeconds(now, this.referenceDate);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  openModal() {
    this.isModalVisible = true;
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  handleOk() {
    this.isModalVisible = false;
  }
}
