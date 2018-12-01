import { Component, OnInit } from '@angular/core';

import { ApiService } from './api.service';
import { Page } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  readonly DEFAULT_PAGENAME = 'Example page';
  readonly DEFAULT_MARKDOWN = '# Example page\n\nSome text _here_.\n';

  alertMessage;
  pages: Page[];

  pageId;
  pageName;
  pageMarkdown;

  constructor(protected apiService: ApiService) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.apiService.getAllPages().subscribe((response) => {
      this.pages = response.pages;
      console.log(this.pages);
    });
  }

  newPage() {
    this.pageId = undefined;
    this.pageName = this.DEFAULT_PAGENAME;
    this.pageMarkdown = this.DEFAULT_MARKDOWN;
  }

  delete() {
    // TODO
  }

  pageExists(): boolean {
    return this.pageId !== undefined;
  }

  load(id: number) {
    this.apiService.getPage(id).subscribe((response) => {
      const page = response.page;
      this.pageId = page.id;
      this.pageName = page.name;
      this.pageMarkdown = page.markdown;
      this.updateRendering(page.html);
    });
  }

  updateRendering(html: string) {
    // TODO
  }

  save() {
    // TODO
  }

  success(message: string) {
    // TODO
  }

  error(message: string) {
    // TODO
  }
}
