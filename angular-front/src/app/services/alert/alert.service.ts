import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private _success = new Subject<string>();
  private _loading = new Subject<string>();

  getAlert(): Observable<string>{
    return this._success.asObservable();
  }

  showAlert(msg: string): void {
    this._success.next(msg);
  }

  getLoadingAlert(): Observable<string> {
    return this._loading.asObservable();
  }

  showLoadingAlert(loadMsg: string): void {
    this._loading.next(loadMsg);
  }
}
