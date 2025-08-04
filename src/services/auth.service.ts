import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected realPassword = 'noemicchia';
  protected isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  checkAuth(pwd: string) {
    return pwd === this.realPassword
  }

  storeAuth(b: boolean) {
    this.isAuthenticated$.next(b)
  }

  selectAuth() {
    return this.isAuthenticated$
  }
}
