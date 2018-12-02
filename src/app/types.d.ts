import { HttpErrorResponse } from '@angular/common/http';

export interface Response {
  success: boolean;
}

export interface Page {
  id: number;
  name: string;
  markdown?: string;
  html?: string;
}

export interface PagePayload {
  name?: string;
  markdown: string;
}

export interface PageResponse extends Response {
  page: Page;
}

export interface PagesResponse extends Response {
  pages: Page[];
}

export interface ErrorResponse extends HttpErrorResponse {
  error: {
    success: false;
    error: string;
  };
}
