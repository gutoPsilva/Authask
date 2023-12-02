import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiURL: string = 'http://localhost:3000/email/';

  constructor(private http: HttpClient) {}

  sendEmail(email: string) {
    const url = this.apiURL + 'send-token';
    return this.http.post(url, { email }, {
      withCredentials: true,
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => error);
  }
}
