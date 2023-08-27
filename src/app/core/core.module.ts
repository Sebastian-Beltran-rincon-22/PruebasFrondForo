import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [
    HeaderComponent,
    AsideComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports:[
    AsideComponent,
    LoaderComponent
  ]
})
export class CoreModule { }
