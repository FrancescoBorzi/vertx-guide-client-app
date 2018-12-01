import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PageResponse, PagesResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:8080/api/';

  constructor(protected httpClient: HttpClient) {}

  getAllPages() {
    return this.httpClient.get<PagesResponse>(this.baseUrl + 'pages');
  }

  getPage(id: number) {
    return this.httpClient.get<PageResponse>(this.baseUrl + 'pages/' + id);
  }
}
