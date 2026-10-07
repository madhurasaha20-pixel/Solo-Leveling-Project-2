import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppHeaderComponent } from './shared/ui/header.component';
import { provideCore } from './core/core.providers';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, AppHeaderComponent],
  providers: [provideCore()],
  bootstrap: [AppComponent]
})
export class AppModule { }
