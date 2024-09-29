import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TrainReservationComponent } from './train-reservation.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, TrainReservationComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }