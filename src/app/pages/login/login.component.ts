import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {


  contactForm!: FormGroup;

  constructor(private authService: AuthService,
    private router: Router,
    private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.contactForm = this.initFrom();
  }

  signIn() {
    this.authService.signIn(this.contactForm.value)
      .subscribe(res => {
        console.log(res)
        localStorage.setItem('token', res.token)
        this.router.navigate(['/profile'])
      },
        err => console.log(err)
      )
  }

  onSubmit(): void {
    console.log('form ->', this.contactForm.value);
  }

  initFrom(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }
}

