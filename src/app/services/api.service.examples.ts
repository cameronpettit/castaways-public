/**
 * API Service Usage Examples
 *
 * This file demonstrates how to use the ApiService for CRUD operations
 */

import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

/**
 * Example 1: Basic CRUD Operations
 */
@Component({
  selector: 'app-example-basic',
  template: ''
})
export class ExampleBasicComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit() {
    // GET - Fetch all users
    this.api.get('/users').subscribe({
      next: (users) => console.log('Users:', users),
      error: (error) => console.error('Error:', error)
    });

    // GET with query parameters
    this.api.get('/users', {
      params: { page: 1, limit: 10, role: 'admin' }
    }).subscribe({
      next: (users) => console.log('Filtered users:', users)
    });

    // POST - Create new user
    const newUser = { name: 'John Doe', email: 'john@example.com' };
    this.api.post('/users', newUser).subscribe({
      next: (user) => console.log('Created user:', user),
      error: (error) => console.error('Error creating user:', error)
    });

    // PUT - Update entire user
    const updatedUser = { name: 'John Smith', email: 'john.smith@example.com' };
    this.api.put('/users/123', updatedUser).subscribe({
      next: (user) => console.log('Updated user:', user)
    });

    // PATCH - Partial update
    this.api.patch('/users/123', { status: 'active' }).subscribe({
      next: (user) => console.log('Patched user:', user)
    });

    // DELETE - Remove user
    this.api.delete('/users/123').subscribe({
      next: () => console.log('User deleted'),
      error: (error) => console.error('Error deleting user:', error)
    });
  }
}

/**
 * Example 2: Advanced Options
 */
@Component({
  selector: 'app-example-advanced',
  template: ''
})
export class ExampleAdvancedComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit() {
    // Custom headers (e.g., authentication)
    this.api.get('/protected-resource', {
      headers: {
        'Authorization': 'Bearer your-token-here',
        'X-Custom-Header': 'custom-value'
      }
    }).subscribe({
      next: (data) => console.log('Protected data:', data)
    });

    // Custom timeout (5 seconds)
    this.api.get('/slow-endpoint', {
      timeout: 5000
    }).subscribe({
      next: (data) => console.log('Data:', data),
      error: (error) => console.error('Request timed out:', error)
    });

    // Array query parameters
    this.api.get('/items', {
      params: {
        ids: [1, 2, 3, 4],
        tags: ['urgent', 'important']
      }
    }).subscribe({
      next: (items) => console.log('Items:', items)
    });
  }
}

/**
 * Example 3: File Upload
 */
@Component({
  selector: 'app-example-upload',
  template: ''
})
export class ExampleUploadComponent {
  constructor(private api: ApiService) {}

  // Single file upload
  uploadSingleFile(file: File) {
    this.api.upload('/upload', file, {
      userId: '123',
      description: 'Profile photo'
    }).subscribe({
      next: (response) => console.log('Upload success:', response),
      error: (error) => console.error('Upload failed:', error)
    });
  }

  // Multiple files upload
  uploadMultipleFiles(files: File[]) {
    this.api.upload('/upload/batch', files, {
      category: 'documents',
      tags: ['2024', 'important']
    }).subscribe({
      next: (response) => console.log('Batch upload success:', response)
    });
  }

  // File upload from input element
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadSingleFile(input.files[0]);
    }
  }
}

/**
 * Example 4: File Download
 */
@Component({
  selector: 'app-example-download',
  template: ''
})
export class ExampleDownloadComponent {
  constructor(private api: ApiService) {}

  downloadFile(fileId: string) {
    this.api.download(`/files/${fileId}`).subscribe({
      next: (blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `file-${fileId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Download failed:', error)
    });
  }

  downloadWithParams() {
    this.api.download('/export/users', {
      params: {
        format: 'csv',
        filters: 'active'
      }
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'users-export.csv';
        link.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}

/**
 * Example 5: Service Configuration
 */
@Component({
  selector: 'app-example-config',
  template: ''
})
export class ExampleConfigComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit() {
    // Set custom base URL
    this.api.setBaseUrl('https://api.example.com/v1');

    // Set default headers (e.g., authentication token)
    this.api.setDefaultHeaders({
      'Authorization': 'Bearer your-token-here',
      'X-API-Key': 'your-api-key'
    });

    // Set default timeout
    this.api.setDefaultTimeout(60000); // 60 seconds

    // Now all requests will use these settings
    this.api.get('/users').subscribe({
      next: (users) => console.log('Users:', users)
    });
  }
}

/**
 * Example 6: Error Handling
 */
@Component({
  selector: 'app-example-errors',
  template: ''
})
export class ExampleErrorHandlingComponent {
  constructor(private api: ApiService) {}

  fetchDataWithErrorHandling() {
    this.api.get('/users').subscribe({
      next: (data) => {
        console.log('Success:', data);
      },
      error: (error) => {
        // Error object contains: status, statusText, data, message
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error data:', error.data);

        // Handle specific error codes
        switch (error.status) {
          case 400:
            console.error('Bad Request');
            break;
          case 401:
            console.error('Unauthorized - redirect to login');
            break;
          case 403:
            console.error('Forbidden');
            break;
          case 404:
            console.error('Not Found');
            break;
          case 500:
            console.error('Server Error');
            break;
          default:
            console.error('Unknown Error');
        }
      }
    });
  }
}

/**
 * Example 7: Health Check / Ping
 */
@Component({
  selector: 'app-example-ping',
  template: ''
})
export class ExamplePingComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit() {
    // Check if API is available
    this.api.ping('/health').subscribe({
      next: (isAvailable) => {
        if (isAvailable) {
          console.log('API is available');
        } else {
          console.log('API is not available');
        }
      }
    });
  }
}

/**
 * Example 8: Real-world S3 Integration
 */
@Component({
  selector: 'app-example-s3',
  template: ''
})
export class ExampleS3Component implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit() {
    // Get S3 objects with signed URLs
    this.api.get('/s3', {
      params: {
        prefix: 'documents/bylaws',
        maxKeys: 50
      }
    }).subscribe({
      next: (response: any) => {
        console.log('Total objects:', response.totalCount);
        console.log('Objects:', response.objects);

        // Each object has a signedUrl property
        response.objects.forEach((obj: any) => {
          console.log('File:', obj.key);
          console.log('Signed URL:', obj.signedUrl);
          console.log('Size:', obj.size);
        });
      },
      error: (error) => console.error('Error fetching S3 objects:', error)
    });
  }
}
