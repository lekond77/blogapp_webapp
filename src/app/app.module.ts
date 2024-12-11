import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule
],
  providers: [provideHttpClient(), /* {
    provide: LOCALE_ID, useValue: 'fr-FR'
  } */],
  bootstrap: [AppComponent]
})
export class AppModule { }
