import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface S3Document {
  key: string;
  lastModified: string;
  size: number;
  storageClass: string;
  signedUrl: string;
}

interface S3Response {
  objects: S3Document[];
  totalCount: number;
  isTruncated: boolean;
}

@Component({
  selector: 'app-resources',
  imports: [CommonModule, FormsModule],
  templateUrl: './resources.html',
  styleUrl: './resources.scss'
})
export class ResourcesComponent implements OnInit {
  meetingMinutes: S3Document[] = [];
  loadingMeetings = false;
  errorMeetings: string | null = null;

  // Season selection
  availableSeasons: string[] = [];
  selectedSeason: string = '';

  private readonly API_URL = 'https://k71qihj0ve.execute-api.ca-central-1.amazonaws.com/prod';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.initializeSeasons();
    if (this.selectedSeason) {
      this.fetchMeetingMinutes();
    }
  }

  initializeSeasons(): void {
    // Generate seasons from 2020 to current year + 1
    const currentYear = new Date().getFullYear();
    const startYear = 2020;

    for (let year = currentYear + 1; year >= startYear; year--) {
      this.availableSeasons.push(`${year}-${year + 1}`);
    }

    // Set default to current season
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 8) { // September or later
      this.selectedSeason = `${currentYear}-${currentYear + 1}`;
    } else {
      this.selectedSeason = `${currentYear - 1}-${currentYear}`;
    }
  }

  onSeasonChange(): void {
    this.fetchMeetingMinutes();
  }

  fetchMeetingMinutes(): void {
    if (!this.selectedSeason) return;

    this.loadingMeetings = true;
    this.errorMeetings = null;

    // Set the API base URL
    this.api.setBaseUrl(this.API_URL);

    this.api.get<S3Response>('/s3', {
      params: {
        prefix: `documents/meeting-minutes/${this.selectedSeason}`
      },
      credentials: 'omit'
    }).subscribe({
      next: (response) => {
        // Filter out objects with no size (folders/empty objects)
        this.meetingMinutes = (response.objects || []).filter(doc => doc.size && doc.size > 0);
        this.loadingMeetings = false;
      },
      error: (err) => {
        console.error('Error fetching meeting minutes:', err);
        this.errorMeetings = 'Failed to load meeting minutes. Please try again later.';
        this.loadingMeetings = false;
      }
    });
  }

  getFileName(key: string): string {
    return key.split('/').pop() || key;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  downloadDocument(document: S3Document): void {
    window.open(document.signedUrl, '_blank');
  }
}
