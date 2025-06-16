import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {
  orte: any[] = [];
  selectedOrt: any = null;
  wetter: any = null;
  warnung: string | null = null;
  newLat = '';
  newLon = '';

  popupVisible: boolean = false;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.loadOrte();
    this.weatherService.connectWebSocket();
    this.weatherService.getWsMsges().subscribe(msg => {
      this.warnung = msg;
      this.popupVisible = true;
    });

  }

  loadOrte() {
    this.weatherService.getAllOrte().subscribe(orte => this.orte = orte);
  }

  addOrt() {
    const lat = parseFloat(this.newLat);
    const lon = parseFloat(this.newLon);
    if (isNaN(lat) || isNaN(lon)) return;
    this.weatherService.addOrt(lat, lon).subscribe(() => {
      this.loadOrte();
      this.newLat = '';
      this.newLon = '';
    });
  }

  deleteOrt(id: number) {
    this.weatherService.deleteOrtById(id).subscribe(() => this.loadOrte());
  }

  selectOrt(ort: any) {
    this.selectedOrt = ort;
    this.weatherService.fetchWeather(ort.lat, ort.lon).subscribe(() => {
      this.weatherService.getWeatherByOrtId(ort.id).subscribe(wetter => this.wetter = wetter);
    });
  }

  closePopup() {
    this.popupVisible = false;
  }

}
