import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeader } from '../fragments/page-header/page-header';
import { PdfViewer } from '../fragments/pdf-viewer/pdf-viewer';
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
  selector: 'app-bylaws',
  imports: [PageHeader, PdfViewer, CommonModule],
  templateUrl: './bylaws.html',
  styleUrl: './bylaws.scss'
})
export class BylawsComponent implements OnInit {
  bylawsDocuments: S3Document[] = [];
  constitutionDocuments: S3Document[] = [];
  loadingConstitution = true;
  loadingBylaws = true;
  errorConstitution: string | null = null;
  errorBylaws: string | null = null;
  selectedConstitutionDoc: S3Document | null = null;
  selectedBylawsDoc: S3Document | null = null;

  private readonly API_URL = 'https://k71qihj0ve.execute-api.ca-central-1.amazonaws.com/prod';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.fetchConstitution();
    this.fetchBylaws();
  }

  fetchConstitution(): void {
    this.loadingConstitution = true;
    this.errorConstitution = null;

    // Set the API base URL
    this.api.setBaseUrl(this.API_URL);

    this.api.get<S3Response>('/s3', {
      params: {
        prefix: 'documents/constitution'
      },
      credentials: 'omit'
    }).subscribe({
      next: (response) => {
        this.constitutionDocuments = (response.objects || []).filter(doc => doc.size && doc.size > 0);
        if (this.constitutionDocuments.length > 0) {
          this.selectedConstitutionDoc = this.constitutionDocuments[0];
        }
        this.loadingConstitution = false;
      },
      error: (err) => {
        console.error('Error fetching constitution:', err);
        this.errorConstitution = 'Failed to load constitution documents. Please try again later.';
        this.loadingConstitution = false;
      }
    });
  }

  fetchBylaws(): void {
    this.loadingBylaws = true;
    this.errorBylaws = null;

    // Set the API base URL
    this.api.setBaseUrl(this.API_URL);

    this.api.get<S3Response>('/s3', {
      params: {
        prefix: 'documents/bylaws'
      },
      credentials: 'omit' // Don't send credentials to avoid CORS issues with wildcard
    }).subscribe({
      next: (response) => {
        // Filter out objects with no size (folders/empty objects)
        this.bylawsDocuments = (response.objects || []).filter(doc => doc.size && doc.size > 0);
        // Auto-select the first document if available
        if (this.bylawsDocuments.length > 0) {
          this.selectedBylawsDoc = this.bylawsDocuments[0];
        }
        this.loadingBylaws = false;
      },
      error: (err) => {
        console.error('Error fetching bylaws:', err);
        this.errorBylaws = 'Failed to load bylaws documents. Please try again later.';
        this.loadingBylaws = false;
      }
    });
  }

  selectConstitutionDoc(document: S3Document): void {
    this.selectedConstitutionDoc = document;
  }

  selectBylawsDoc(document: S3Document): void {
    this.selectedBylawsDoc = document;
  }

  selectDocument(document: S3Document): void {
    // Legacy method for backward compatibility
    this.selectedBylawsDoc = document;
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

  downloadDocument(document: S3Document, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    window.open(document.signedUrl, '_blank');
  }
}
