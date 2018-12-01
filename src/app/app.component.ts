import { Component, OnInit } from '@angular/core';

import { ApiService } from './api.service';
import { Page } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  alertMessage;
  pages: Page[];

  constructor(protected apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getAllPages().subscribe((data) => {
      this.pages = data.pages;
      console.log(this.pages);
    });
  }

  reload() {}
  newPage() {}
  delete() {}
  pageExists(): boolean { return true; }
  save() {}
}
