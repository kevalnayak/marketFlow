import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderModule } from './shared/loader/loader.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TokenInterceptorInterceptor } from './shared/token-interceptor.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    LoaderModule,
    ToastrModule.forRoot()
  ],
  providers: [

    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
