import { Component, inject, OnInit } from '@angular/core';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [
    NzFlexModule,
    NzCardModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzAlertModule,
    CommonModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  loggedIn: boolean = false;

  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    password: this.fb.control('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.storeAuth(false)
  }

  checkPwd() {}

  submitForm(): void {
    if (this.validateForm.valid) {
      const insertedPwd = this.validateForm.get('password')?.value || '';
      if (this.authService.checkAuth(insertedPwd)) {
        this.loggedIn = true;
        this.authService.storeAuth(true);
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      } else {
        console.log("Il valore NON è 'pippo'");
        // fai qualcos'altro o mostra errore
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
