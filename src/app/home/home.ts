import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageHeader } from '../pages/fragments/page-header/page-header';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, PageHeader],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

  stats = [
    { value: '50+', label: 'Years of History' },
    { value: '10+', label: 'Active Teams' },
    { value: '3', label: 'Leagues' }
  ];
}
