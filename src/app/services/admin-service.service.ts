import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(private http: HttpClient) { }

  url = 'https://ngo-backend-4032850793.asia-south1.run.app';

  getBanners() {
    return this.http.get(`${this.url}/api/banners`);
  }

addBanners(params: any) {
    return this.http.post(`${this.url}/api/banners`, params);
  }

  updateBanners(params: any) {
    return this.http.put(`${this.url}/api/banners/${params.id}`, params);
  }

  deleteBanners(id: number) {
    return this.http.delete(`${this.url}/api/banners/${id}`);
  }


  getServices() {
    return this.http.get(`${this.url}/api/services`);
  }

  addServices(params: any) {
    return this.http.post(`${this.url}/api/services`, params);
  }

  updateServices(params: any) {
    return this.http.put(`${this.url}/api/services/${params.id}`, params);
  }

  deleteServices(id: number) {
    return this.http.delete(`${this.url}/api/services/${id}`);
  }

  getMembers() {
    return this.http.get(`${this.url}/api/team-members`);
  }

  addMembers(params: any) {
    return this.http.post(`${this.url}/api/team-members`, params);
  }

  updateMembers(params: any) {
    return this.http.put(`${this.url}/api/team-members/${params.id}`, params);
  }

  deleteMembers(id: number) {
    return this.http.delete(`${this.url}/api/team-members/${id}`);
  }

  getMediaAppearances() {
    return this.http.get(`${this.url}/mediaAppearances`);
  }

  getVolunteers() {
    return this.http.get(`${this.url}/api/volunteers`);
  }

  addVolunteer(params: any) {
    return this.http.post(`${this.url}/api/volunteers`, params);
  }

  updateVolunteer(params: any) {
    return this.http.put(`${this.url}/api/volunteers/${params.id}`, params);
  }

  deleteVolunteer(id: number) {
    return this.http.delete(`${this.url}/api/volunteers/${id}`);
  }

  getImages() {
    return this.http.get(`${this.url}/api/media`);
  }

  addmedia(params: any) {
    return this.http.post(`${this.url}/api/media`, params);
  }

  updateMedia(params: any) {
    return this.http.put(`${this.url}/api/media/${params.id}`, params);
  }

  deleteMedia(id: number) {
    return this.http.delete(`${this.url}/api/media/${id}`);
  }

  login(params:any){
    return this.http.post(`${this.url}/api/users/login`, params);
  }

  uploadImage(params: any) {
    return this.http.post(`${this.url}/api/home/upload`, params);
  }

  deleteImage(id: number) {
    return this.http.delete(`${this.url}/images/${id}`);
  }

  getNews() {
    return this.http.get(`${this.url}/api/news`);
  }

  addNews(params: any) {
    return this.http.post(`${this.url}/api/news`, params);
  }

  updateNews(params: any) {
    return this.http.put(`${this.url}/api/news/${params.id}`, params);
  }

  deleteNews(id: number) {
    return this.http.delete(`${this.url}/api/news/${id}`);
  }

  getDonors() {
    return this.http.get(`${this.url}/api/donations/donors`);
  }

  getDonations() {
    return this.http.get(`${this.url}/api/donations`);
  }

  getReviews() {
    return this.http.get(`${this.url}/api/reviews`);
  }

  addReview(params: any) {
    return this.http.post(`${this.url}/api/reviews`, params);
  }

  updateReview(params: any) {
    return this.http.put(`${this.url}/api/reviews/${params.id}`, params);
  }

  deleteReview(id: number) {
    return this.http.delete(`${this.url}/api/reviews/${id}`);
  }
}
