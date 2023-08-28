import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  constructor(private authService: AuthService ,
    private readonly fb: FormBuilder,
    private router:Router){}

  contactForm!:FormGroup;

  ngOnInit(): void {
    this.contactForm = this.initFrom();
    this.signUp()
  }

  signUp(){
    this.authService.signUp(this.contactForm.value)
    .subscribe( res =>{
      console.log(res)
      localStorage.setItem('token', res.token)
      this.router.navigate(['/home'])
    },
    err => console.log(err)
    )
  }


  onSubmit(): void {
    console.log('form ->',this.contactForm.value);
  }

  initFrom(): FormGroup {
    return this.fb.group ({
      userName: ['',[Validators.required,Validators.minLength(3)]],
      email: ['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(8)]],
    })
}
}
