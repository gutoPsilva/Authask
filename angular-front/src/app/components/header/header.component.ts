import { Component } from '@angular/core';
import { faLock } from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  loggedUser:boolean = false;
  lock = faLock;
}
