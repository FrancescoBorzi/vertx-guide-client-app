import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PageResponse, PagesResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:8080/';
  apiUrl = this.baseUrl + 'api/';

  constructor(protected httpClient: HttpClient) {}

  getAllPages() {
    return this.httpClient.get<PagesResponse>(this.apiUrl + 'pages');
  }

  getPage(id: number) {
    return this.httpClient.get<PageResponse>(this.apiUrl + 'pages/' + id);
  }

  getMarkDown(markdown: string) {
    return this.httpClient.post<string>(
      this.baseUrl + 'app/markdown',
      markdown,
      { responseType: 'text' as 'json' },
    );
  }
}
