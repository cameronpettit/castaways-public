import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';
import { SidebarComponent } from './sidebar/sidebar';
import { SidebarService } from './services/sidebar.service';
import { CommonModule } from '@angular/common';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommonModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('castaways-public');

  constructor(
    protected sidebarService: SidebarService
  ) {}

}
