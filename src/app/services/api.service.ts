import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  timeout?: number;
  credentials?: RequestCredentials; // 'include' | 'same-origin' | 'omit'
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number = 30000; // 30 seconds

  constructor() {
    // Set base URL from environment or use default
    this.baseUrl = this.getBaseUrl();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Get the base URL for API requests
   * Can be configured via environment variables or constants
   */
  private getBaseUrl(): string {
    // Check if running in browser
    if (typeof window !== 'undefined') {
      // Use environment-specific URL or fallback to current origin
      return window.location.origin.includes('localhost')
        ? 'http://localhost:3000/api'
        : `${window.location.origin}/api`;
    }
    return '/api';
  }

  /**
   * Set a custom base URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Set default headers for all requests
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Set default timeout for all requests
   */
  setDefaultTimeout(timeout: number): void {
    this.defaultTimeout = timeout;
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Make a fetch request with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Process response and handle errors
   */
  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText,
        data,
        message: data?.message || data?.error || response.statusText
      };
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };
  }

  /**
   * Generic request method
   */
  private request<T = any>(
    method: string,
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Observable<T> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = { ...this.defaultHeaders, ...options.headers };
    const timeout = options.timeout || this.defaultTimeout;

    const requestOptions: RequestInit = {
      method,
      headers,
      credentials: options.credentials || 'same-origin' // Default to 'same-origin' for better CORS compatibility
    };

    if (options.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = typeof options.body === 'string'
        ? options.body
        : JSON.stringify(options.body);
    }

    const request = this.fetchWithTimeout(url, requestOptions, timeout)
      .then(response => this.processResponse<T>(response))
      .then(response => response.data);

    return from(request).pipe(
      catchError(error => {
        console.error(`API Error [${method} ${endpoint}]:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET request
   */
  get<T = any>(endpoint: string, options: ApiRequestOptions = {}): Observable<T> {
    return this.request<T>('GET', endpoint, options);
  }

  /**
   * POST request
   */
  post<T = any>(endpoint: string, body?: any, options: ApiRequestOptions = {}): Observable<T> {
    return this.request<T>('POST', endpoint, { ...options, body });
  }

  /**
   * PUT request
   */
  put<T = any>(endpoint: string, body?: any, options: ApiRequestOptions = {}): Observable<T> {
    return this.request<T>('PUT', endpoint, { ...options, body });
  }

  /**
   * PATCH request
   */
  patch<T = any>(endpoint: string, body?: any, options: ApiRequestOptions = {}): Observable<T> {
    return this.request<T>('PATCH', endpoint, { ...options, body });
  }

  /**
   * DELETE request
   */
  delete<T = any>(endpoint: string, options: ApiRequestOptions = {}): Observable<T> {
    return this.request<T>('DELETE', endpoint, options);
  }

  /**
   * Upload file(s) using FormData
   */
  upload<T = any>(
    endpoint: string,
    files: File | File[],
    additionalData?: Record<string, any>,
    options: ApiRequestOptions = {}
  ): Observable<T> {
    const formData = new FormData();

    // Add files to FormData
    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append(`file${index}`, file, file.name);
      });
    } else {
      formData.append('file', files, files.name);
    }

    // Add additional data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      });
    }

    // Remove Content-Type header to let browser set it with boundary
    const { 'Content-Type': _, ...headersWithoutContentType } = this.defaultHeaders;
    const headers = { ...headersWithoutContentType, ...options.headers };
    delete headers['Content-Type'];

    return this.request<T>('POST', endpoint, {
      ...options,
      headers,
      body: formData as any
    });
  }

  /**
   * Download file as blob
   */
  download(endpoint: string, options: ApiRequestOptions = {}): Observable<Blob> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = { ...this.defaultHeaders, ...options.headers };
    const timeout = options.timeout || this.defaultTimeout;

    const requestOptions: RequestInit = {
      method: 'GET',
      headers,
      credentials: options.credentials || 'same-origin'
    };

    const request = this.fetchWithTimeout(url, requestOptions, timeout)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Download failed: ${response.statusText}`);
        }
        return response.blob();
      });

    return from(request).pipe(
      catchError(error => {
        console.error(`Download Error [${endpoint}]:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if endpoint is available (health check)
   */
  ping(endpoint: string = '/ping'): Observable<boolean> {
    return this.get(endpoint).pipe(
      map(() => true),
      catchError(() => from([false]))
    );
  }
}
