import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "./components/header/header.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HeaderComponent
],
  providers: [provideHttpClient(), /* {
    provide: LOCALE_ID, useValue: 'fr-FR'
  } */],
  bootstrap: [AppComponent]
})
export class AppModule { }
