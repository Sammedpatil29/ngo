import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private http: HttpClient) { }

  url = 'https://ngo-backend-4032850793.asia-south1.run.app';

  getHomeData() {
    return this.http.get(`${this.url}/api/home`);
  }

  getVolunteers() {
    return this.http.get(`${this.url}/api/volunteers/active`);
  }

  getServices() {
    return this.http.get(`${this.url}/api/services/active`);
  }

  donorByPhone(phone: string) {
    return this.http.get(`${this.url}/api/donations/phone/${phone}`);
  }
}
