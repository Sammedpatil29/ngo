import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
interface Image {
  id: number;
  place: string;
  url: string;
  isActive: boolean;
}

interface Category {
  id: number;
  name: string;
  url: string;
  images: Image[];
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/api/media';

  getMedia(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  addCategory(category: Omit<Category, 'id' | 'images'>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/category`, category)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/category/${category.id}`, category)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/category/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  addImage(image: Omit<Image, 'id'> & { categoryId: number }): Observable<Image> {
    return this.http.post<Image>(`${this.baseUrl}/image`, image)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateImage(image: Image): Observable<Image> {
    return this.http.put<Image>(`${this.baseUrl}/image/${image.id}`, image)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/image/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}