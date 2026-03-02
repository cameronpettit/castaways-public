import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeader } from '../fragments/page-header/page-header';
import { BoardOfDirectors } from '../fragments/board-of-directors/board-of-directors';
import { ClubhouseLocation } from '../fragments/clubhouse-location/clubhouse-location';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [CommonModule, PageHeader, BoardOfDirectors, ClubhouseLocation, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutComponent {

}
