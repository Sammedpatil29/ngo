import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private http: HttpClient) { }

  url = environment.apiUrl;

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

  createDonation(data: any) {
    return this.http.post(`${this.url}/api/donations`, data);
  }

  createAutoDonation(params: any) {
    return this.http.post(`${this.url}/api/donations/subscribe-custom`, params);
  }

  verifyPayment(data: any) {
    return this.http.post(`${this.url}/api/donations/verify`, data);
  }
}
