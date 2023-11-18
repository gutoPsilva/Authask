import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ITask } from 'src/interfaces/tasks.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiURL = 'http://localhost:3000/tasks/';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<ITask[]> {
    return this.http
      .get<ITask[]>(this.apiURL, { withCredentials: true }) // it needs the credentials to check the session.id and the req.user :)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
