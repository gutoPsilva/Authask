import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import {
  ProfileDetails,
  UploadResponse,
} from 'src/interfaces/profile.interface';
import { DeleteImageResponse } from '../../../interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiURL = 'http://localhost:3000/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ProfileDetails> {
    return this.http
      .get<ProfileDetails>(this.apiURL, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('pfp', file);

    return this.http
      .post<UploadResponse>(this.apiURL + '/upload', formData, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  deleteImage(): Observable<DeleteImageResponse> {
    return this.http
      .delete<DeleteImageResponse>(this.apiURL + '/upload', {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => error);
  }
}
