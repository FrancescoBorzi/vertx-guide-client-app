import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PagesResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:8080/api/';

  constructor(protected httpClient: HttpClient) {}

  getAllPages() {
    return this.httpClient.get<PagesResponse>(this.baseUrl + 'pages');
  }
}
