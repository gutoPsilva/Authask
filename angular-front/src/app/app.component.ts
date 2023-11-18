import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs';
import { AlertService } from './services/alert/alert.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private alertService: AlertService) {}
  title = 'auth-todo';

  loadingIcon = faSpinner;

  @ViewChild('loadingAlert', { static: false }) loadingAlert!: NgbAlert;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert!: NgbAlert;
  _alert = this.alertService.getAlert();
  _loading = this.alertService.getLoadingAlert();
  alertMessage: string = '';
  loadingMessage: string = '';

  ngOnInit(): void {
    // infinite Loading till !message
    this._loading.subscribe((message) => (this.loadingMessage = message));

    // selfClosing
    this._alert.subscribe((message) => {
      this.alertMessage = message;
    });

    this._alert.pipe(debounceTime(10000)).subscribe(() => {
      // hide message after 10 secs if !closeClick
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
  }
}
