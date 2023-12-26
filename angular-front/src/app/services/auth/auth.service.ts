import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  DiscordUser,
  IUserLogin,
  LocalUser,
  IRegisterLocalUser,
  UserLogoutMsg,
  ResetUserPass,
} from 'src/interfaces/auth.interface';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL: string = 'http://localhost:3000/auth/';

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  private userSubject: BehaviorSubject<LocalUser | DiscordUser | null> =
    new BehaviorSubject<LocalUser | DiscordUser | null>(null);

  user = this.userSubject.asObservable();

  login(user: IUserLogin): Observable<LocalUser> {
    const url = this.apiURL + 'login';
    console.log(url, user);
    return this.http
      .post<LocalUser>(url, user, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  registerLocalUser(registerInfo: IRegisterLocalUser) {
    const url = this.apiURL + 'signup';
    return this.http
      .post<LocalUser>(url, registerInfo)
      .pipe(catchError(this.handleError));
  }

  signin(): Observable<DiscordUser> {
    const url = this.apiURL + 'discord';
    window.open(url, '_blank');

    return new Observable<DiscordUser>((observer) => {
      window.addEventListener(
        'message',
        (e) => {
          if (e.origin !== 'http://localhost:3000') return;

          observer.next(e.data);
          observer.complete();
        },
        false
      );
    });

    // return this.http.get<DiscordUser>(url).pipe(catchError(this.handleError));
  }

  loadUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { user, expirationDate } = JSON.parse(storedUser);
      if (new Date().getTime() > expirationDate) {
        localStorage.removeItem('user');
      } else this.userSubject.next(user);
    }
  }

  setUser(user: LocalUser | DiscordUser | null) {
    this.userSubject.next(user);
    if (user) {
      const expirationDate = new Date().getTime() + 1000 * 60 * 60 * 4; // after setting the user, 4 hours later the cookie and the localStorage must be destroyed
      localStorage.setItem('user', JSON.stringify({ user, expirationDate }));
    } else localStorage.removeItem('user');
  }

  getUser(): Observable<LocalUser | DiscordUser | null> {
    return this.userSubject.asObservable();
  }

  logout() {
    const url = this.apiURL + 'logout';
    return this.http
      .delete<UserLogoutMsg>(url, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  resetPassword(resetDetails: ResetUserPass) {
    const url = this.apiURL + 'reset-password';
    return this.http.patch(url, resetDetails).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError(() => error);
  }
}
