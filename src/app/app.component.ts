import { Component, OnInit, Sanitizer, SecurityContext } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

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
  renderedHtml: SafeHtml;
  keyUp = new Subject<any>();

  pageId;
  pageName;
  pageMarkdown;

  constructor(
    private apiService: ApiService,
    private sanitazer: Sanitizer,
  ) {}

  ngOnInit() {
    this.reload();
    this.initLiveRendering();
  }

  reload() {
    this.apiService.getAllPages().subscribe((response) => {
      this.pages = response.pages;
    });
  }

  initLiveRendering() {
    this.keyUp.pipe(
      map(event => event.target.value),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((newMarkDown: string) => {
      this.apiService.getMarkDown(newMarkDown).subscribe((newHtml) => {
        this.updateRendering(newHtml);
      });
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
    this.renderedHtml = this.sanitazer.sanitize(SecurityContext.HTML, html);
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
