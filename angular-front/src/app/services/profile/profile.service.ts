import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ProfileDetails } from 'src/interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiURL = 'http://localhost:3000/profile';

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http
      .get<ProfileDetails>(this.apiURL, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => error);
  }
}
