import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ITask, ITaskInfo, ITaskStats } from 'src/interfaces/tasks.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiURL = 'http://localhost:3000/tasks/';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<ITask[]> {
    return this.http
      .get<ITask[]>(this.apiURL, { withCredentials: true }) // it needs the credentials to check the session.id and the req.user 
      .pipe(catchError(this.handleError));
  }

  createTask(taskInfo: ITaskInfo): Observable<ITask> {
    return this.http
      .post<ITask>(this.apiURL, taskInfo, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  updateTask(id: number, updateInfo: ITaskInfo): Observable<ITask> {
    return this.http
      .put<ITask>(this.apiURL + id, updateInfo, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  deleteTask(id: number): Observable<boolean> {
    return this.http
      .delete<boolean>(this.apiURL + id, { withCredentials: true })
      .pipe(catchError(this.handleError)); // it needs the credentials to check the session.id and the req.user 
  }

  userTaskStats(): Observable<ITaskStats>{
    return this.http.get<ITaskStats>(this.apiURL + 'stats', { withCredentials: true });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
