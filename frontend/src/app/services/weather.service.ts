// weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiUrl = 'http://localhost:3000/api/v1/weather';
  private ws: WebSocket | null = null;
  private wsMsg = new Subject<string>();

  constructor(private http: HttpClient) { }

  getAllOrte(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orte`);
  }

  addOrt(lat: number, lon: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/orte`, { lat, lon });
  }

  deleteOrtById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orte/${id}`);
  }

  fetchWeather(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/weather?lat=${lat}&lon=${lon}`);
  }

  getWeatherByOrtId(ort_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/wetterdaten/${ort_id}`);
  }

  connectWebSocket() {
    this.ws = new WebSocket('ws://localhost:3000');
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.wsMsg.next(data.message);
    };
  }

  getWsMsges(): Observable<string> {
    return this.wsMsg.asObservable();
  }
}