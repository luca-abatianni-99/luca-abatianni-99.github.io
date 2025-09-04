import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewportService {
  isHandset$: Observable<boolean>;
  isTablet$: Observable<boolean>;
  isWeb$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$ = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map(result => result.matches), shareReplay());

    this.isTablet$ = this.breakpointObserver
      .observe([Breakpoints.Tablet])
      .pipe(map(result => result.matches), shareReplay());

    this.isWeb$ = this.breakpointObserver
      .observe([Breakpoints.Web])
      .pipe(map(result => result.matches), shareReplay());
  }
}
