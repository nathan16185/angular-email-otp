import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  @Input() email: string;
  @Output() logOutuser = new EventEmitter<boolean>();

  logOut() {
    this.logOutuser.emit(true);
  }
}
