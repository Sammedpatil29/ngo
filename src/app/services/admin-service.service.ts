import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000';

  getBanners() {
    return this.http.get(`${this.url}/banners`);
  }

  getServices() {
    return this.http.get(`${this.url}/services`);
  }

  getMembers() {
    return this.http.get(`${this.url}/members`);
  }

  getMediaAppearances() {
    return this.http.get(`${this.url}/mediaAppearances`);
  }

  getVolunteers() {
    return this.http.get(`${this.url}/volunteers`);
  }

  getImages() {
    return this.http.get(`${this.url}/images`);
  }

  login(params:any){
    return this.http.post(`${this.url}/api/users/login`, params);
  }
}
