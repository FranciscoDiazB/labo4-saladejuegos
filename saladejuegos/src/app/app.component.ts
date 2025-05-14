import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./componentes/navbar/navbar.component";
import { ChatComponent } from './componentes/chat/chat.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Wild West Games';
}
